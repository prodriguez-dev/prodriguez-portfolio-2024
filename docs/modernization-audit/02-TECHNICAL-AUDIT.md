# 02 — Technical Audit

Severity scale: **Critical** (security or site-wide defect), **High** (user-visible or blocks modernization), **Medium** (maintainability, performance, correctness edge), **Low** (hygiene).
Status: **Verified** = reproduced from source, build output, or live probe. **Risk** = plausible, not reproduced.
Complexity: S (< 1 h of agent work), M (1–3 h), L (half day+).

---

## A. Dependency health and security

### F-01 · Next.js 14.1.3 is end-of-life and carries multiple high/critical advisories — Critical · Verified · S (patch) / L (major upgrade)
- Evidence: `package.json` pins `"next": "14.1.3"`. `npm audit --omit=dev` lists advisories against `next` including server-function endpoint disclosure, image-optimization RCE vectors (AVIF/SVG), Server Actions DoS, and an authorization-bypass advisory; plus a nested vulnerable `postcss` under `node_modules/next`. External trackers list Next 14 as EOL (2025-10-26) and Next 15 LTS ending 2026-10-21; current stable is 16.x.
- Exposure: the site has no middleware and no remote image sources, so the most severe advisories are hard to reach, but an EOL framework on a public domain is still the top risk and blocks every other modernization step (ESLint 9, React 19, Node 24 on Vercel).
- Fix: Step 1 (safe, minutes): bump to the latest `14.2.x` (`npm audit` suggests 14.2.35) with `eslint-config-next` to match; no code changes expected. Step 2: migrate to Next 16 via the official codemods (`npx @next/codemod@canary upgrade latest`). Known touch points in this repo: `params` becomes a Promise in `app/[uid]/page.tsx`, `app/projects/[uid]/page.tsx`, `app/blog/[uid]/page.tsx` (both the page and `generateMetadata`); `next lint` is removed in 16 (move to ESLint 9 flat config); Turbopack becomes the default bundler (Sass is supported); React 19 types (`@types/react@19`).
- Benefit: closes all `next` advisories, restores vendor support, unlocks current tooling.

### F-02 · `swiper` (critical prototype-pollution advisory) and `react-reconciler` are installed but never imported — Critical (audit) / Low (actual exposure) · Verified · S
- Evidence: `grep -rn swiper src` and `grep -rn react-reconciler src` return nothing. `npm audit` flags swiper 6.5.1–12.1.1 as critical.
- Fix: `npm uninstall swiper react-reconciler`. Also run `npm audit fix` (non-force) for `source-map-js`.

### F-03 · Node.js runtime is unpinned while Vercel deprecates Node 20 — High · Risk · S
- Evidence: no `engines` field, no `.nvmrc`. README says "Node 18.17+". Vercel's current default is Node 24; Node 20 is deprecated as of 2026-10-01 and Node 18 is unavailable. Next 14.1 was never tested against Node 24.
- Fix: add `"engines": { "node": ">=22" }` and `.nvmrc` = `22` (or `24` after the Next 16 upgrade), and confirm the Vercel project's Node setting in the dashboard (**needs Paul**).

### F-04 · Sass `@import` is deprecated; `includePaths` points at a non-existent directory — Medium · Verified · M
- Evidence: `next.config.mjs` `additionalData: '@import "src/scss/variables.scss"; @import "src/scss/mixins.scss";'` and `includePaths: [path.join(__dirname, "styles")]` (no `styles/` dir). `mixins.scss`/`functions.scss` also use `@import`. Dart Sass 3.0 removes `@import`.
- Fix options: (a) convert to `@use`/`@forward`; (b) **recommended**: retire Sass. What Sass still does is small: the reset, the `sP()` fluid-scaling mixin (used by 4 `global-text-*` classes and a few legacy selectors), and dead legacy classes. All of it maps to plain CSS + Tailwind `clamp()` utilities. See 05-ROADMAP P2-03.

### F-05 · Tooling config drift — Low · Verified · S
- `.prettierrc.json` is shadowed by `.prettierrc` (delete it). `.stylelintrc.json` references uninstalled packages (fix or delete). `.eslintrc.json` is ESLint 8 legacy format (must become flat config for Next 16). Browserslist DB is 7 months old (dev-only warning).

---

## B. Correctness defects

### F-06 · Display typography never renders in the condensed fonts — Critical (visual) · Verified in build and on the live site · S
- Evidence: every display heading, eyebrow, nav logo, footer logo, stat number, card title, and the hero `h1` uses `font-[var(--font-sofia-sans-extra-condensed)]` or `font-[var(--font-sofia-sans-condensed)]`. Tailwind 3 cannot infer the property for an arbitrary `var()` value in the `font-` namespace and resolves it as **font-weight**. Compiled CSS (local build and `https://www.prodriguez.dev/_next/static/css/*.css`):
  ```
  .font-\[var\(--font-sofia-sans-extra-condensed\)\]{font-weight:var(--font-sofia-sans-extra-condensed)}
  ```
  `font-weight: "__Sofia_Sans_Extra_Condensed_…"` is invalid and is dropped by the browser. The elements inherit `font-family` from `body` (`$sofia` = regular Sofia Sans). The entire "condensed black italic" display system the redesign was built around is not in effect. `tailwind.config.ts` already defines `fontFamily.sans-condensed` and `fontFamily.sans-extra-condensed`, so the intended classes `font-sans-condensed` / `font-sans-extra-condensed` exist and are unused.
- Fix: replace all occurrences (`grep -rn "font-\[var(--font-sofia" src`) with the theme classes; delete the `.sofia-*` SCSS helpers. Then **visually re-check every page**: the condensed faces are narrower, so `clamp()` sizes, `max-w-*`, `whitespace-nowrap` on the hero name, and line-heights were tuned against the wrong font and may need re-tuning.
- Benefit: the single largest visual improvement available, at near-zero cost.

### F-07 · Project detail pages use the legacy dark theme — High · Verified (source) · M
- Evidence: `src/lib/content-rendering.tsx` renders `bg-gray-900`, `text-gray-50`, `text-blue-50`, `prose-invert`, `border-gray-100`, and `Button` renders `bg-gray-900`. Every other page uses the warm light system (`#f4f1eb`, `#ede9e1`, white cards, `#c4621a` accent). Users clicking a featured project on the home page land on a page from a different site.
- Fix: rebuild `renderContentEntry` and `renderSlice` with the light card system and a proper case-study layout (05-ROADMAP P1-03). Browser confirmation of the mismatch is recommended before redesign but the source evidence is unambiguous.

### F-08 · `/projects` index never links to project detail pages; 8 projects are orphaned — High · Verified · S–M
- Evidence: `ProjectsExplorer` in `InteractiveSections.tsx` renders expand/collapse rows with an optional external "Visit Site" link and **no** `<Link href={item.href}>`. Only the 4 home-page featured cards and the prev/next navigation slices link into `/projects/[uid]`. `projectListOrder` in `phase-one-pages.tsx` lists 14 uids; `ice-miller`, `wilson-elser`, `robinson-cole`, `ub-greensfelder`, `patterson-belknap`, `five-seasons-windows`, `rhyme-on-a-dime`, `windy-city-classics` have detail pages, are in the sitemap, and are reachable from nowhere.
- Fix: add a "View case study" link per row; decide (Paul) whether the 8 orphans are promoted, folded into an "Archive" group, or removed from the build and sitemap.

### F-09 · Heading hierarchy: `/projects` and `/ai-workflows` have no `h1` — Medium · Verified · S
- `DisplayHeading` renders `h2`; `ProjectsPageSectionBlock` and `TextSectionBlock` use it as the page title. Add an `as` prop and render `h1` for page titles.

### F-10 · Image metadata and sources are wrong or heavy — Medium · Verified · S (code) + needs assets from Paul
- `stageImage` is declared `1800×2200` but the file is `1570×750`. `standingImage` is declared `1000×1800` but the file is a **300×636 8-bit PNG** displayed up to 430 px wide (upscaled, soft). `paul-rodriguez-auxo-midshot_6_2025.png` is 1.7 MB and `paul-rodriguez-with-elderly-people.png` is 2.1 MB (next/image re-encodes on request, but source weight slows the optimizer and dev). `apple-touch-icon.png` is a JPEG with a `.png` extension. `og-image.jpg` is byte-identical to the hero photo.
- Fix: correct declared dimensions; export the two PNG photos as optimized JPEG/WebP ≤ 300 KB; obtain a higher-resolution standing cutout (**needs Paul**); make a real 1200×630 OG image (or generate one with `next/og`).

### F-11 · `next/image fill` used 6 times with no `sizes` — Medium · Verified · S
- Without `sizes`, the browser assumes `100vw` and picks the largest candidate. The 48 px testimonial avatars, 56 px project thumbnails, and the 340 px about headshot all download oversized files. Add `sizes` to each (`"48px"`, `"88px"`, `"(min-width: 768px) 340px, 100vw"`, `"100vw"` for the hero).

### F-12 · `generateStaticParams` on `[uid]` includes `contact`, which `app/contact/page.tsx` already owns — Low · Verified · S
- Harmless duplication (static route wins). Either delete `app/contact/page.tsx` or exclude `contact` from the `[uid]` params. Also consider `export const dynamicParams = false` on both `[uid]` routes so unknown slugs 404 at the edge without invoking a render.

### F-13 · `scripts/export-prismic-content.mjs` cannot run — Low · Verified · S
- Imports `@prismicio/client`, not in `node_modules`. The CMS migration is complete. Delete the script or move it to a `legacy/` note in the README.

### F-14 · Date handling edge — Low · Risk · S
- `new Date("2026-06-01").getFullYear()` parses as UTC midnight; in US time zones at build time a `YYYY-01-01` date would display the prior year. `formatDate` double-parses through `toLocaleString`. Replace with a small `parseISODate` helper that splits the string.

---

## C. Code organization and maintainability

### F-15 · `phase-one-pages.tsx` is a 1,282-line god module — High · Verified · M
- It holds: section TypeScript types, all image constants, all page copy, project decoration maps, 20 section components, metadata generation, and the page router. Content edits require touching JSX; component refactors risk copy regressions.
- Fix: split into `src/content/pages/{home,about,projects,ai-workflows,silver-tech-help,contact}.ts` (data only, typed by `src/content/page-types.ts`) and `src/components/sections/*.tsx` (one file per section or logical group), with `src/lib/pages.ts` keeping `getPhaseOneContent`, `getPhaseOneMetadata`, `renderPhaseOnePage`. Pure move, no behavior change; verify by diffing rendered HTML before/after.

### F-16 · No design tokens; ~15 hex colors repeated as arbitrary utilities — High · Verified · M
- `grep -o "#[0-9a-f]\{6\}" src/**/*.tsx | sort | uniq -c` shows the same values (`#c4621a`, `#b85b17`, `#e0dbd0`, `#ede9e1`, `#f4f1eb`, `#111111`, `#4d4a45`, `#67625c`, `#7a7570`, `#5f5a54`, `#666666`, `#ece8df`, `#bdb8ae`, `#d8d2c7`, `#1a1610`) across hundreds of class strings, plus repeated `rounded-[16px|20px|24px]` and `shadow-[0_2px_16px_rgba(0,0,0,0.05)]`. The contrast fixes in 03-UI-UX-AUDIT are impractical without tokens.
- Fix: define `theme.extend.colors` (`surface`, `surface-alt`, `card`, `line`, `line-strong`, `ink`, `ink-soft`, `ink-muted`, `accent`, `accent-text`, `accent-deep`, `hero`), `borderRadius` (`card`, `card-lg`, `pill`, `btn`), `boxShadow` (`card`, `card-hover`), and `fontFamily` (already present). Codemod the literals. Keep CSS variables behind the tokens so a dark mode can be added later without touching components.

### F-17 · Dead code and unused assets — Low · Verified · S
- Unused components: `Avatar.tsx`, `ContentList.tsx`; `usePrefersReducedMotion` only used by `Avatar`. Unused SCSS: `.sofia-*`, `.background-*`, `.stroke-*`, `.tags`, `.footer-*`, `.navbar-nav`, `.global-center-align`, `.cookie-consent*`, `.app`, `.svg-inline--fa`, `body:not(.prerender) .page { opacity: 0 }` (a latent trap: any element classed `page` becomes invisible), `z()` function referencing undefined `$z-indexes`. Unused public assets: `next.svg`, `vercel.svg`, `bg/abstract-pattern-1.svg`, `sounds/*.ogg`. The skills marquee in `SkillsSectionBlock` is wrapped in `className="hidden"` and references `animate-[marquee_…]` keyframes that are never defined. Empty `blog` route.
- Fix: delete, or (for blog) keep the route and types but document it as dormant.

### F-18 · Hydration warnings are suppressed globally — Low · Verified · S
- `<body suppressHydrationWarning>` in `layout.tsx` hides real mismatches. Remove it; if a mismatch appears (none expected; the footer year is the usual culprit), fix the root cause.

### F-19 · Minor type/API hygiene — Low · Verified · S
- `Heading.tsx` accepts `ref`/`style` as `any` props and passes `ref` as a normal prop (no-op). `Button.label: string | null`. `ContentList` registers `ScrollTrigger` at module scope. `InteractiveSections.ExperienceItem` duplicates the type in `phase-one-pages.tsx`. All resolved by the split in F-15 and the detail-page rebuild in F-07.

---

## D. Performance

### F-20 · Font declarations: 54 `@font-face` rules — Medium · Verified · S
- Three families × 9 weights × 2 styles. The browser only downloads what is used, but the CSS and preload hints grow, and `next/font` inlines fallback metrics for each. Observed usage: body 400/500/600, labels 700/800, display 900 italic (condensed/extra-condensed). Trim to the weights actually used after F-06 lands (likely `["400","500","700","800","900"]` for Sofia Sans and `["800","900"]` italic for the condensed faces).

### F-21 · GSAP in the shared bundle for a hover effect — Low · Verified · S
- `NameLogo` imports `gsap` + `SplitText` for a logo hover scramble, so GSAP is in the layout chunk on every page (shared First Load 84 kB). `HeroMotion` also needs GSAP on `/`. Either move the logo effect to CSS, or `next/dynamic` the animated logo, or accept it. Low priority; measure with a Lighthouse run before deciding.

### F-22 · Hero typing effect re-renders per character — Low · Verified · S
- `HeroMotion` sets React state every 38 ms for ~60 characters. Fine in practice; could write to a `ref`'d text node instead. Also see accessibility note in 03 about live text and reduced motion.

---

## E. Security configuration

### F-23 · No security headers beyond HSTS — High · Verified (live) · S
- Add via `next.config` `headers()` for `/(.*)`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`), and a `Content-Security-Policy` starting in **report-only** mode. Next 14/16 with inline styles from `next/font` and GSAP needs `style-src 'self' 'unsafe-inline'`; scripts can use a nonce only with dynamic rendering, so for this static site use `script-src 'self'` plus hashes or accept `'unsafe-inline'` initially. Verify with the browser console on the preview deployment before enforcing.

### F-24 · Contact API hardening — High · Verified · S–M
- `route.ts` returns the raw Resend error body to the client on 502 (information leakage) and the 503 message names the env vars. There is no abuse control (no honeypot, no minimum fill time, no rate limit, no CAPTCHA). Subject and name are interpolated into the email subject/body without stripping newlines.
- Fix: log provider errors server-side and return a generic message; add a hidden honeypot field and a client-side timestamp check (reject < 3 s); strip control characters; cap field lengths; optionally add Vercel BotID or Cloudflare Turnstile (the latter needs keys from Paul). In-memory rate limiting is unreliable on serverless; do not rely on it. Confirm `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, and a verified `CONTACT_EMAIL_FROM` domain in Vercel (**needs Paul**). Set `export const runtime = "nodejs"` explicitly and `maxDuration = 10`.

### F-25 · CORS header on `/api/*` targets the wrong origin — Low · Verified · S
- `Access-Control-Allow-Origin: https://prodriguez.dev` while the canonical origin is `https://www.prodriguez.dev`. The form posts same-origin so CORS never applies; the header block is dead config. Remove it (and the `Allow-Credentials: true`, which should never pair with a public form).

---

## F. SEO and structured metadata

### F-26 · No structured data — Medium · Verified · S
- No `application/ld+json` anywhere. Add `Person` (name, jobTitle, url, sameAs GitHub/LinkedIn, image) on `/` and `/about`, `WebSite` on `/`, and `CreativeWork`/`Article`-style data on project pages.

### F-27 · Duplicated site URL constants and generic sitemap — Low · Verified · S
- `SITE_URL` is defined in `metadata.ts` and again in `sitemap.ts`; `robots.ts` hardcodes it a third time. Sitemap `lastModified` is the build time for every URL. Centralize in `src/lib/site.ts`; use project `date` for `lastModified`; add `twitter.creator`, `theme-color`, and a web manifest.

### F-28 · Project entries have no `metaDescription` — Low · Verified · S
- All 22 fall back to the first description bullet, which is acceptable but often starts with "Built …" rather than a sentence that names the client and outcome. Author descriptions for at least the top 6 projects (**content task**).

---

## G. Testing, CI, observability

### F-29 · No tests, no CI, no preview gate — High · Verified · M
- Add GitHub Actions on PR and push to `master`: `npm ci`, `tsc --noEmit`, lint, `next build`, unit tests, Playwright smoke. Vercel preview deployments are **ASSUMED** to exist via the Git integration; confirm in the dashboard.
- Test baseline (small, high value): Vitest for `metadata.ts` helpers, `content-data.ts`, contact payload validation (extract `validateContactPayload` so client and server share it); Playwright smoke: every sitemap URL returns 200 and has one `h1`, nav works on mobile, contact form shows validation errors, `@axe-core/playwright` reports no serious/critical violations on `/`, `/about`, `/projects`, one project page, `/contact`.

### F-30 · No analytics or error visibility — Low · Risk · S
- Optional: `@vercel/analytics` + `@vercel/speed-insights` (one component each, privacy-friendly). Skip third-party trackers. Vercel function logs cover the contact route.

---

## Summary table

| ID | Finding | Severity | Status | Complexity | Roadmap |
|---|---|---|---|---|---|
| F-01 | Next 14.1.3 EOL + advisories | Critical | Verified | S then L | P0-01, P1-01 |
| F-02 | Unused swiper/react-reconciler | Critical (audit) | Verified | S | P0-02 |
| F-06 | Condensed fonts never applied | Critical (visual) | Verified live | S | P0-03 |
| F-23 | No security headers | High | Verified live | S | P0-04 |
| F-24 | Contact API hardening | High | Verified | S–M | P0-05 |
| F-03 | Node unpinned / Vercel Node 20 deprecation | High | Risk | S | P0-06 |
| F-07 | Detail pages on legacy dark theme | High | Verified | M | P1-03 |
| F-08 | Projects index doesn't link; 8 orphans | High | Verified | S–M | P1-04 |
| F-15 | 1,282-line page module | High | Verified | M | P1-02 |
| F-16 | No design tokens | High | Verified | M | P1-02 |
| F-29 | No tests/CI | High | Verified | M | P1-09, P1-10 |
| F-09 | Missing h1 on two pages | Medium | Verified | S | P1-05 |
| F-10 | Wrong image dimensions / heavy PNGs / low-res cutout | Medium | Verified | S + assets | P1-06 |
| F-11 | `fill` without `sizes` | Medium | Verified | S | P1-06 |
| F-04 | Sass @import deprecated | Medium | Verified | M | P2-03 |
| F-20 | 54 font-face declarations | Medium | Verified | S | P1-11 |
| F-26 | No JSON-LD | Medium | Verified | S | P1-08 |
| F-05, F-12, F-13, F-14, F-17, F-18, F-19, F-21, F-22, F-25, F-27, F-28, F-30 | Hygiene | Low | Verified/Risk | S | P2-xx |
