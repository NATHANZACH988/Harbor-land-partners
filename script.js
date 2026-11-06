(() => {
  const $ = (s) => document.querySelector(s);
  const menuButton = $('#menuButton');
  const nav = $('#primaryNav');
  menuButton?.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    nav.querySelectorAll('a').forEach(a => a.classList.toggle('active', a === link));
  }));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.focus();
    }
  });

  const form = $('#dealForm');
  const state = $('#formState');
  const panel = $('#summaryPanel');
  const summaryText = $('#summaryText');
  const summaryStatus = $('#summaryStatus');
  const submitButton = $('#submitButton');
  const previewMode = location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname);
  if (state && !previewMode) state.textContent = 'Complete this form to submit an inquiry for review. You will receive an on-screen confirmation after it is accepted.';
  const fieldLabels = [
    ['fullName','Full name'], ['email','Email'], ['phone','Phone'], ['role','Contact role'],
    ['location','Location / market'], ['county','County and state'], ['apn','Parcel ID / APN'],
    ['acreage','Approximate acres'], ['price','Asking price / budget (USD)'],
    ['listingStatus','Status'], ['timeline','Timing'], ['propertyLink','Reference link'], ['details','Details / criteria']
  ];
  const showStatus = (msg, kind) => {
    state.textContent = msg;
    state.className = `form-status${kind ? ' ' + kind : ''}`;
  };
  const prepare = (payload, delivered=false) => {
    const lines = [
      'HARBOR LAND PARTNERS — INITIAL INQUIRY',
      `Prepared: ${new Date().toLocaleString()}`,
      '---------------------------------------',
      ...fieldLabels.map(([key,label]) => `${label}: ${payload[key] || 'Not provided'}`),
      '---------------------------------------',
      'Submission is an inquiry only, not a contract, listing, agency agreement, or offer.'
    ];
    summaryText.value = lines.join('\n');
    panel.hidden = false;
    summaryStatus.textContent = delivered
      ? 'Your details were sent to the configured receiving service. A copy is below.'
      : 'Preview only. Nothing has been sent. Copy or save these details until secure delivery is configured.';
    showStatus(delivered ? 'Submission sent to the configured receiving service.' : 'Summary prepared — no information has been transmitted.', delivered ? 'success' : '');
    panel.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',block:'nearest'});
  };
  // Local preview only. On Netlify, leave the form's native POST intact so Netlify
  // captures the submission and redirects to the branded thank-you page.
  // Form detection must be enabled in the Netlify site dashboard.
  form?.addEventListener('submit', (e) => {
    if (!previewMode) return;
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      showStatus('Please complete the required fields and consent checkbox.', 'error');
      return;
    }
    const data = new FormData(form);
    if (data.get('website')) return;
    const payload = Object.fromEntries(fieldLabels.map(([key]) => [key, String(data.get(key) || '').trim()]));
    prepare(payload, false);
  });
  $('#copySummary')?.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(summaryText.value); $('#summaryStatus').textContent='Summary copied to clipboard. No new submission was sent.'; }
    catch (_) { summaryText.focus(); summaryText.select(); $('#summaryStatus').textContent='Select and copy the highlighted summary. No information was sent.'; }
  });
  $('#downloadSummary')?.addEventListener('click', () => {
    const blob = new Blob([summaryText.value], {type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'harbor-land-partners-inquiry.txt'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  });
  $('#editSummary')?.addEventListener('click', () => { panel.hidden=true; form.scrollIntoView({behavior:'smooth',block:'start'}); form.querySelector('input')?.focus({preventScroll:true}); });
})();
