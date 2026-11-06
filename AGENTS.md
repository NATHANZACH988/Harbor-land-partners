# Claude Code — Harbor Land Partners

Maintain the real Harbor Land Partners website. Do not replace its approved editorial design with a generic template.

Read `README.md`, `docs/DESIGN_LOCK.md`, `docs/INTAKE.md`, and `docs/DEPLOYMENT.md` before editing.

- Retain the emerald-and-gold lighthouse aesthetic, waterfront photography, typographic hierarchy and compact photo/about/submit layout.
- Prioritize responsive usability, legible contrast, accessibility, performance and maintainability over framework churn. The site currently uses semantic HTML, CSS and vanilla JS. Do not migrate frameworks without clear benefit and approval.
- Preserve discreet and legible disclosures on illustrative property photos; do not present fictional listings, transactions, ROI, timelines, or testimonials as real.
- Keep Netlify form intake native and protect all credentials and internal CRM identifiers. No API token or webhook secret may be included in frontend source.
- Staged submissions are unverified and never auto-cleared as eligible sellers, verified buyer bids, or transaction permissions.
- For every change, run `python3 -m unittest discover -s tests -v`, `node --check script.js`, and `node --check config.js`.
- Propose changes through pull requests. Do not merge, deploy, send outreach, or enter transactions without approval.
