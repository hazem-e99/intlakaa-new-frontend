# Next.js Migration Guide (Production)

## 1) Current React Project Structure (Before)

```text
frontend/
  index.html
  vite.config.ts
  src/
    main.tsx
    App.tsx
    pages/
      Index.tsx
      Form.tsx
      ThankYou.tsx
      AdsLanding.tsx
      Blog.tsx
      BlogPost.tsx
      DynamicPage.tsx
      Login.tsx
      ChangePassword.tsx
      AcceptInvite.tsx
      Dashboard.tsx
      Requests.tsx
      Settings.tsx
      ManageAdmins.tsx
      SEOManagement.tsx
      PagesManagement.tsx
      PageEditor.tsx
      PostEditor.tsx
```

## 2) Proposed Next.js Structure (After)

```text
frontend/
  pages/
    _app.tsx
    _document.tsx
    index.tsx
    form.tsx
    thank-you.tsx
    ads.tsx
    404.tsx
    blog/
      index.tsx
      [slug].tsx
    admin/
      index.tsx
      login.tsx
      change-password.tsx
      accept-invite.tsx
      requests.tsx
      settings.tsx
      manage-admins.tsx
      seo-management.tsx
      pages/
        index.tsx
        [id].tsx
      posts/
        [id].tsx
    [slug].tsx
  src/
    lib/
      routerCompat.tsx
      serverApi.ts
    components/
      seo/
        SeoHead.tsx
        DynamicTrackingScripts.tsx
      AdminPageWrapper.tsx
```

## 3) Critical Performance + SEO Improvements Applied

- Migrated runtime from Vite SPA to Next.js pages-router with route-level rendering.
- Public content routes are now static with ISR:
  - `/`
  - `/blog`
  - `/blog/[slug]`
  - `/:slug` (published CMS pages)
- Added centralized metadata and OpenGraph/Twitter tags via reusable `SeoHead`.
- Added JSON-LD structured data:
  - Organization + Website on homepage
  - Blog + ItemList on blog listing
  - BlogPosting on post pages
  - WebPage on dynamic CMS pages
- Implemented automated sitemap + robots generation with `next-sitemap`.
- Replaced critical visual assets with `next/image` (logo and hero + blog covers).
- Migrated analytics/pixel injection to `next/script` with non-blocking strategies.
- Backend integration now targets Node.js API endpoints (no Supabase dependency).
- Kept all existing UI/component logic intact through router compatibility shim.
- Preserved admin/business logic and auth guards while moving to file-based routes.

## 4) Step-by-Step Migration and Refactoring

### Step A: Foundation
- Replace Vite scripts with Next scripts in `package.json`.
- Add `next.config.mjs` with bundle analyzer support and route-compat aliases.
- Add `next-env.d.ts` and Next-compatible `tsconfig.json`.

### Step B: Routing Migration
- Create Next route files under `pages/` matching every previous React route.
- Wrap admin routes with:
  - `ProtectedRoute`
  - `AdminLayout`
- Keep existing component/page logic untouched by importing from `src/pages/*`.

### Step C: SSR/SSG + ISR
- Create server fetch helpers in `src/lib/serverApi.ts`.
- Use `getStaticProps` and `getStaticPaths` for crawlable routes.
- Use ISR (`revalidate`) to refresh CMS content without full redeploy.

### Step D: SEO Layer
- Create reusable `SeoHead` component for metadata/canonical/OG/Twitter.
- Inject per-page JSON-LD schema blocks.
- Add `next-sitemap.config.js` and `postbuild` generation.

### Step E: Runtime Performance
- Convert LCP/brand images to `next/image`.
- Add preconnect + preload hints in `_document.tsx`.
- Keep non-critical scripts deferred/lazy.
- Preserve lazy-loaded sections and split heavy routes.

## 5) Post-Migration Optimization Checklist

### Performance
- [ ] Run `npm run analyze` and remove large optional deps from critical routes.
- [ ] Keep admin/editors client-only and lazy-loaded.
- [ ] Continue using `next/image` for all new visual assets.
- [ ] Track Core Web Vitals (LCP, INP, CLS) in production.
- [ ] Audit third-party scripts quarterly and remove stale pixels.

### SEO
- [ ] Validate metadata and canonical for every new route.
- [ ] Extend structured data for new content types.
- [ ] Ensure sitemap is regenerated on each production build.
- [ ] Verify robots rules after adding new admin/internal routes.
- [ ] Monitor Search Console indexing + Lighthouse SEO score after each release.
