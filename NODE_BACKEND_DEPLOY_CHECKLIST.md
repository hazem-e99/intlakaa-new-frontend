# Node Backend Deployment Checklist

This project now uses a Node.js API backend (not Supabase).

## 1. Frontend Environment (Next.js)

Set these variables in your hosting provider for the frontend app:

- `NEXT_PUBLIC_API_URL=https://your-api-domain.com`
- `NEXT_PUBLIC_SITE_URL=https://your-frontend-domain.com`

Notes:

- `NEXT_PUBLIC_API_URL` must be the backend base URL without `/api`.
- The frontend client builds requests as `${NEXT_PUBLIC_API_URL}/api/...`.

## 2. Backend Environment (Node.js)

Set these variables in your backend host:

- `PORT=5000` (or provider default)
- `WEB3FORMS_ACCESS_KEY=your_key` (if backend forwards form email)
- Any DB/Auth secrets required by your backend app

## 3. CORS and Security

- Allow frontend origin(s) in backend CORS config.
- Allow only production domains in production (avoid wildcard in production).
- Enable HTTPS on both frontend and backend.
- Keep secrets only on backend, never in client bundles.

## 4. API Readiness Checks

- Health endpoint returns success (for example `/` or `/health`).
- Public form endpoint works end-to-end.
- Admin auth endpoints return expected status codes.
- Requests list/create/delete endpoints work with production database.

## 5. Frontend Build and SEO

Run from frontend root:

- `npm run build`
- Confirm sitemap/robots generation from postbuild (`next-sitemap`).

Validate output files:

- `public/sitemap.xml`
- `public/robots.txt`

## 6. Runtime Validation

After deployment verify:

- Home, form, blog, and dynamic pages load without console errors.
- Admin login and protected routes behave correctly.
- Form submission creates request records and sends email flow.
- GTM events fire (`page_view`, `form_submit`, `generate_lead`).

## 7. Performance and Monitoring

- Run `npm run analyze` before major releases.
- Monitor Core Web Vitals (LCP, INP, CLS) in production.
- Track API latency and 5xx error rate on backend.
- Alert on auth failures and request creation failures.

## 8. Rollback Plan

- Keep previous stable frontend deployment ready.
- Keep previous stable backend image/build ready.
- Roll back frontend and backend together if API contracts changed.
