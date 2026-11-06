# Harbor Land Partners — Netlify launch instructions

1. Confirm the GitHub repository is **Private**. Never commit account credentials or customer submissions.
2. Connect the repository in Netlify: **Add new project → Import an existing project → GitHub**.
3. Select branch `main`, leave build command empty, set publish directory to `.`. `netlify.toml` already configures this.
4. Confirm a valid HTTPS `*.netlify.app` temporary address and review the website on desktop and mobile.
5. Enable **Netlify Forms**; ensure the `deal-intake` form is detected. Configure a form submission email notification to a business mailbox from Netlify's dashboard.
6. Submit a test inquiry. Confirm it appears in Netlify and triggers the email. A thank-you page alone does not confirm successful submission.
7. Connect the Netlify form event via a secured server-side integration to the existing Airtable **Website Submissions** table; test deduplication and the unverified defaults described in `docs/INTAKE.md`.
8. Add a verified business contact, complete privacy/legal review, and change domain later if desired.

Do not advertise a working deal intake channel until the end-to-end test succeeds.
