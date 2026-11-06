# Harbor website — inbound submission handling

## Status
Netlify Forms is implemented in the static webpage. **No live deployment, email notification, or CRM connection is verified yet.** The existing Airtable staging table is managed outside this public-facing code repository. Never put its credentials or private customer submissions here.

## Workflow
1. Public visitor completes the `deal-intake` form. Netlify receives the form securely after it is deployed and form detection is enabled.
2. Netlify stores the form event and alerts the configured business inbox. Verify both by making a test submission after launch.
3. A secured, server-side integration maps the event into a **Website Submissions** staging table, keyed by a stable submission ID; retries are idempotent and original source text is preserved.
4. Every new intake defaults to **Unverified — Needs Review**, **UNKNOWN — No CORE clearance**, and **E0 — No buyer price evidence**. No submitted owner information is treated as county-deed verified.
5. A qualified reviewer checks parcel identity, ownership, authority to sign, constraints, buyer box and pricing separately. Do not contact a buyer or seller, present an offer, or execute a transaction without explicit approval.

## Form field names
`fullName`, `email`, `phone`, `role`, `location`, `county`, `apn`, `acreage`, `price`, `listingStatus`, `timeline`, `propertyLink`, `details`, `consent`.

## Security / privacy
- No Airtable API keys, Netlify access tokens, webhook secrets, or live contact data in client JavaScript or this repository.
- Protect Netlify notifications/webhooks from unauthorized access; validate payloads, handle retries and duplicates, and log failures without personal details.
- Keep a private audit of source IDs and status changes. Do not use form submissions for unsolicited marketing.
- Verify the consent language, privacy notice, business contact, and applicable laws before promoting the live site.

## Go-live acceptance test
A live submission must (1) appear in Netlify Forms, (2) trigger an email notification, (3) create **one** unverified staging record in Airtable with the original fields, and (4) not generate outbound contact, contract or ownership clearance. Repeat the same event and verify duplicate prevention.
