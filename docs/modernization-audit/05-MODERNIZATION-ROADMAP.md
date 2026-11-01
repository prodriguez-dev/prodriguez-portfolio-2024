# 05 — Modernization Roadmap

Effort key: **S** < 1 h agent time, **M** 1–3 h, **L** 3–6 h. Token cost is relative: **$** small (few files, little reading), **$$** moderate, **$$$** large (many files or repeated build/test loops). Model recommendation per task is in 06-EXECUTION-STRATEGY.

Guiding decisions (see §7 for tradeoffs):
- Keep Next.js App Router, static generation, local TypeScript content, Tailwind, GSAP, Vercel.
- Upgrade Next to the current major (16.x) via 14.2.x as an intermediate checkpoint.
- Keep Tailwind 3.4 for this round; tokenize the theme. Tailwind 4 is optional later.
- Retire Sass (small surface) rather than migrate `@import` → `@use`.
- No CMS, no database, no dark mode, no new animation libraries.

---

## P0 — Critical (security, defects, deployment blockers)

### P0-01 · Patch Next.js to latest 14.2.x
- Impact: closes all current `next` advisories without code changes. Complexity: S · Cost: $.
- Dependencies: none. Files: `package.json`, `package-lock.json`.
- Approach: `npm install next@14.2 eslint-config-next@14.2` (use the exact latest 14.2.x reported by `npm view next@14 version`). Run `npm audit --omit=dev`.
- Acceptance: `npm audit --omit=dev` shows no `next`/`postcss` advisories; `tsc`, `lint`, `build` pass; 35 pages generated.
- Validation: build log; `npm audit` output pasted into the checklist.

### P0-02 · Remove unused dependencies and apply safe audit fixes
- Impact: removes the critical `swiper` advisory and dead weight. S · $.
- Files: `package.json`, lockfile.
- Approach: `npm uninstall swiper react-reconciler`; `npm audit fix` (no `--force`); `npx update-browserslist-db@latest`.
- Acceptance: zero imports broken; build passes; `npm audit --omit=dev` reports 0 critical.

### P0-03 · Fix the display font utility bug
- Impact: restores the intended condensed typography site-wide. S · $ (but triggers visual re-tuning in P1-07).
- Files: every `.tsx` using `font-[var(--font-sofia-sans-*)]` (`HeroMotion`, `InteractiveSections`, `ContactForm`, `Footer`, `NameLogo`, `phase-one-pages`), `globals.scss`.
- Approach: replace `font-[var(--font-sofia-sans-extra-condensed)]` → `font-sans-extra-condensed` and `font-[var(--font-sofia-sans-condensed)]` → `font-sans-condensed` (both already in `tailwind.config.ts`). Remove `.sofia-*` SCSS classes.
- Acceptance: compiled CSS contains `font-family:var(--font-sofia-sans-extra-condensed)` rules and no `font-weight:var(--font-sofia-sans…)`; screenshots show condensed display type; no text clipping at 390/768/1280/1920.
- Validation: `grep -c "font-weight:var(--font-sofia" .next/static/css/*.css` = 0; Playwright screenshots.

### P0-04 · Security headers
- Impact: baseline hardening; visible in any scanner a hiring manager might run. S · $.
- Files: `next.config.mjs`.
- Approach: add `headers()` for `/(.*)`: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options: DENY`, `Content-Security-Policy-Report-Only` (`default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`). Remove the dead CORS block.
- Acceptance: `curl -I` on the preview shows the headers; browser console shows no CSP-report-only violations on all pages; after one clean preview, switch to enforcing CSP.
- Validation: curl + manual console check documented in checklist.

### P0-05 · Harden the contact API and form
- Impact: prevents abuse and information leakage on the only dynamic surface. M · $$.
- Dependencies: none (Turnstile/BotID optional, needs keys from Paul).
- Files: `src/app/api/contact/route.ts`, `src/components/ContactForm.tsx`, new `src/lib/contact-validation.ts`.
- Approach: shared validator (lengths: name ≤ 100, email ≤ 254, subject from allow-list, message 10–4000; strip `\r\n` from subject/name); honeypot field (`company`, visually hidden, must be empty); `startedAt` timestamp, reject < 3 s; generic error messages to client, `console.error` server-side; `runtime = "nodejs"`, `maxDuration = 10`; keep Resend REST (no SDK needed).
- Acceptance: unit tests for the validator; manual POSTs: empty → 400, honeypot filled → 200 (silently dropped) or 400 (choose and document), valid → 200 only when env configured. No provider text in responses.
- Validation: Vitest + curl transcript. **Paul confirms env vars on Vercel.**

### P0-06 · Pin Node and record deployment facts
- Impact: avoids a Vercel runtime surprise. S · $.
- Files: `package.json` (`engines`), `.nvmrc`, `README.md`.
- Approach: `engines.node: ">=22 <25"`, `.nvmrc` `22`. Document in README that the Vercel project should be set to Node 22 (or 24 after P1-01). **Paul verifies in the dashboard.**
- Acceptance: `npm ci` on CI with Node 22 succeeds; README updated.

---

## P1 — High impact

### P1-01 · Upgrade to Next.js 16 (+ React 19, ESLint 9 flat config)
- Impact: supported framework, Turbopack, current tooling. L · $$$.
- Dependencies: P0-01, P0-02. Files: `package.json`, `app/[uid]/page.tsx`, `app/projects/[uid]/page.tsx`, `app/blog/[uid]/page.tsx`, `next.config.mjs`, `.eslintrc.json` → `eslint.config.mjs`, `tsconfig.json`, `next-env.d.ts`.
- Approach: `npx @next/codemod@canary upgrade latest` (accept React 19, async request APIs). Manually: `params: Promise<{uid: string}>` and `await params` in pages and `generateMetadata`; replace `next lint` with `eslint .` using `eslint-config-next` flat exports; verify Sass works under Turbopack (`next build` is sufficient); update `@types/react*` to 19; remove `suppressHydrationWarning` from `<body>`. Check `next/font` and `Image` behavior unchanged.
- Acceptance: `next build` on 16.x produces the same 35 routes; `tsc` and ESLint 9 pass; home, about, projects, one project, contact render identically (screenshot diff); no console errors.
- Validation: build log, screenshot comparison, Playwright smoke (P1-10).

### P1-02 · Design tokens and the page-module split
- Impact: makes every subsequent design/content change cheap and safe; enables the contrast fixes. L · $$$.
- Dependencies: P0-03. Files: `tailwind.config.ts`, `src/lib/phase-one-pages.tsx` (split), new `src/content/pages/*.ts`, `src/content/page-types.ts`, `src/components/sections/*.tsx`, `src/lib/pages.ts`, all components using hex literals.
- Approach: (1) add tokens: colors `surface #f4f1eb`, `surface-alt #ede9e1`, `card #ffffff`, `line #e0dbd0`, `line-strong #cfc8ba`, `line-input #8f887c`, `ink #111111`, `ink-soft #4d4a45`, `ink-muted #67625c`, `accent #c4621a`, `accent-text #9c470d`, `hero #1a1610`, `danger #b23a26`; radii `card 16px`, `card-lg 20px`, `panel 24px`, `btn 10px`; shadows `card`, `card-hover`; font roles `display`, `label`. Implement colors as CSS variables consumed by the Tailwind theme. (2) Write a small Node script that verifies all text-color/background pairs in the token set meet 4.5:1 and commit it under `scripts/check-contrast.mjs`. (3) Replace arbitrary literals with tokens via search/replace, file by file, building after each file. (4) Split `phase-one-pages.tsx` into content files and section components as a pure move; keep exports stable.
- Acceptance: `grep -rn "#[0-9a-fA-F]\{6\}" src/components src/lib src/app` returns only `tailwind.config.ts`/CSS variable definitions; contrast script passes; rendered HTML for all pages is identical except class names (compare text content and DOM structure); build passes.
- Validation: contrast script; `curl` local HTML text diff; screenshots.

### P1-03 · Rebuild project detail pages in the light system
- Impact: the strongest proof pages finally match the site. M–L · $$.
- Dependencies: P1-02. Files: `src/lib/content-rendering.tsx` → `src/components/case-study/*.tsx`, `src/app/projects/[uid]/page.tsx`, `src/lib/content-types.ts` (add optional `role`, `summary`, `outcome`, `stack`, `tier`), `src/content/projects.ts` (populate for Tier 1/2 from existing text only).
- Approach: template = header (eyebrow client · year, h1 title, role, category), summary bullets, outcome callout (only when data exists), slices rendered with light prose styles, image blocks as cards with captions, stack tags, prev/next computed from `projectListOrder`, CTA card. Delete `Bounded`, `Button`, `Heading` if no longer used.
- Acceptance: all 22 pages build; Tier 1 pages show outcome callouts; no `bg-gray-900` anywhere; axe clean; prev/next correct.

### P1-04 · Projects index: card grid that links to case studies; resolve orphans
- Impact: fixes the dead-end IA. M · $$.
- Dependencies: P1-02, Paul's decision on Tier 3. Files: `InteractiveSections.tsx` (ProjectsExplorer), `src/content/pages/projects.ts`, `sitemap.ts`.
- Approach: filterable grid (image, client/year, title, summary, tags, "Read case study" link); categories derived from each entry's `category`; `tier` controls inclusion; Tier 3 entries either render in a compact "Archive" list or are excluded from `generateStaticParams` and sitemap. Default if Paul does not answer: keep all 22, show Tier 3 in the compact archive list.
- Acceptance: every project page has at least one inbound link from `/projects`; sitemap and `generateStaticParams` agree; filter buttons have `aria-pressed`.

### P1-05 · Accessibility pass
- Impact: WCAG 2.2 AA readiness on every page. M · $$.
- Dependencies: P1-02 (tokens for contrast). Files: `layout.tsx` (skip link, `main id`), `NavBar.tsx` (Escape, focus return), `InteractiveSections.tsx` (`aria-expanded`, `aria-controls`, `aria-pressed`), `ContactForm.tsx` (ids, names, autocomplete, `aria-describedby`, `aria-invalid`, live region, focus to success), `HeroMotion.tsx` (reduced motion, live text handling), `reset.scss`/global CSS (input focus-visible), section components (h1 on projects and ai-workflows; glyphs → `aria-hidden` SVG icons).
- Acceptance: axe (serious/critical) = 0 on `/`, `/about`, `/projects`, `/projects/american-national-annuity-application`, `/contact`; keyboard-only walkthrough documented; contrast script passes.

### P1-06 · Images and media
- Impact: faster LCP, crisper visuals. S (code) + assets. $.
- Files: `src/content/pages/*.ts` image constants, section components, `public/images/*`.
- Approach: add `sizes` to all `fill` images; fix declared dimensions; convert the two PNG photos to optimized JPEG/WebP; rename `apple-touch-icon` to a real PNG; create a 1200×630 OG image with name and title (static, designed in code with `next/og` at build or by hand); replace the standing cutout when Paul supplies one.
- Acceptance: Lighthouse on preview: LCP < 2.5 s mobile; no image > 400 KB in `public/images` except the hero; OG preview renders correctly in a card validator.

### P1-07 · Typography and layout re-tune after the font fix
- Impact: the hero and headings finally look designed. M · $$.
- Dependencies: P0-03, P1-02. Files: section components, `HeroMotion.tsx`.
- Approach: define `display-sm/md/lg` clamp tokens; re-check hero name wrapping at 390 px; standardize body sizes (16/17/18) and card body 16 px; vary section spacing (64/96/128); remove marquee and mobile-only pill rows; shorten long card titles per 04 §1 (copy approved by Paul or left unchanged).
- Acceptance: screenshots at four widths with no clipping/overflow; a type-scale table added to `docs/DESIGN.md`.

### P1-08 · SEO structured data and metadata consolidation
- Impact: richer search results; cleaner code. S · $.
- Files: new `src/lib/site.ts`, `src/lib/metadata.ts`, `sitemap.ts`, `robots.ts`, `layout.tsx`, `app/page.tsx`, project page, new `src/components/JsonLd.tsx`.
- Approach: single `SITE_URL`; `Person` + `WebSite` JSON-LD on home, `Person` on about, `CreativeWork` on projects; `themeColor`, `manifest.ts`; sitemap `lastModified` from content dates; `alt=""` on the hero background.
- Acceptance: Google Rich Results test passes for `Person` on the preview URL; sitemap validates; one definition of the site URL.

### P1-09 · CI pipeline
- Impact: every PR is built and tested before merge. S · $.
- Files: `.github/workflows/ci.yml`.
- Approach: on `pull_request` and `push` to `master`: Node 22, `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`, Playwright smoke against `next start` (install browsers with cache). Add scripts: `typecheck`, `test`, `test:e2e`, `format`, `format:check`.
- Acceptance: green run on a PR; status checks required on `master` (**Paul enables branch protection**).

### P1-10 · Test baseline
- Impact: regression safety for the rest of the roadmap. M · $$.
- Files: `vitest.config.ts`, `tests/unit/*.test.ts`, `playwright.config.ts`, `tests/e2e/*.spec.ts`.
- Approach: Vitest for `metadata.ts`, `content-data.ts`, `contact-validation.ts`, `pages.ts` (every page has metadata and h1 data); Playwright: each sitemap URL 200 + exactly one `h1`, nav desktop/mobile, contact validation, axe on five pages, screenshot capture (not pixel-asserted) at four widths for review.
- Acceptance: `npm test` and `npm run test:e2e` pass locally and in CI in < 5 min.

### P1-11 · Trim font weights
- Impact: smaller CSS, fewer preloads. S · $.
- Files: `layout.tsx`.
- Approach: after P1-07 settles, load only used weights/styles per family.
- Acceptance: compiled CSS `@font-face` count ≤ 14; no visible fallback weights (screenshot check).

---

## P2 — Modernization and developer experience

### P2-01 · Dead code and asset removal — S · $
Delete `Avatar.tsx`, `ContentList.tsx`, `usePrefersReducedMotion` (or reuse in HeroMotion), `scripts/export-prismic-content.mjs`, `.prettierrc.json`, `.stylelintrc.json` (or install its deps), unused `public/` files, unused SCSS selectors, the hidden marquee, and the empty blog route (or document it as dormant). Acceptance: build passes; `git ls-files public | xargs -I{} sh -c 'grep -rq "$(basename {})" src || echo {}'` lists nothing unexpected.

### P2-02 · Tooling alignment — S · $
One Prettier config matching the actual style (2 spaces, semicolons, double quotes, trailing commas, Tailwind plugin); `format:check` in CI; ESLint 9 flat config with `eslint-config-next` + `jsx-a11y` recommended; `.editorconfig`; Tailwind `content` globs cleaned. Acceptance: `prettier --check` passes; lint passes.

### P2-03 · Retire Sass — M · $$
Move the reset into `src/styles/globals.css` (plain CSS), replace `global-text-*`/`sP()` with Tailwind `clamp()` tokens, drop `sass`, `sassOptions`, and the SCSS directory. Acceptance: no `.scss` files; build passes; screenshots unchanged.

### P2-04 · Content polish (requires Paul's answers from 04 §3) — M · $$
Hero body and stats rewrite, "How I work" section, testimonial attributions, AI Workflows page rebuild (h1, grid, links to WIK/GitHub, CTA), Great Jakes consolidation, project `summary`/`outcome` fields for Tier 1/2, resume date label. Acceptance: Paul signs off on copy diffs; no invented facts (each new sentence traceable to existing site text or Paul's input).

### P2-05 · Section and card refinement — M · $$
Single `Card` and `Section` component with variants; stats band redesign; featured-project cards with one-line outcome; replace Unicode glyph icons with `react-icons` SVGs. Acceptance: no duplicate card class strings; screenshots reviewed.

### P2-06 · Documentation — S · $
Rewrite `README.md` (stack, scripts, content editing guide, deployment, env vars by name); add `docs/DESIGN.md` (tokens, type scale, spacing); add a repo-level `CLAUDE.md`/`AGENTS.md` describing conventions and the "no invented facts" rule for content. Acceptance: a new contributor can add a project from the README alone.

### P2-07 · Analytics — S · $
`@vercel/analytics` and `@vercel/speed-insights` components in `layout.tsx` (Paul's default yes per 04 §3). Acceptance: events visible in the Vercel dashboard after deploy.

---

## P3 — Optional

- **P3-01 · Per-page OG images with `next/og`** (name/title/project) — M · $$.
- **P3-02 · Blog with MDX** (`@next/mdx`), only if Paul intends to write — L · $$$.
- **P3-03 · Interactive case-study elements** (embedded flow diagrams for American National/WIK as SVG, not animation libraries) — M · $$, needs content from Paul.
- **P3-04 · Dark mode** via the CSS-variable tokens from P1-02 — M · $$.
- **P3-05 · Tailwind 4 migration** with the official codemod, after Sass is retired — M · $$.
- **P3-06 · View Transitions** for route changes (Next 16 supports the API) — S · $.
- **P3-07 · Logo hover effect to CSS** and drop GSAP from the shared chunk — S · $.

---

## 6. Sequencing (minimizes rework)

```
P0-01 → P0-02 → P0-03 → P0-04 → P0-05 → P0-06        (Batch 1: ship as one PR, deploy)
P1-01 (Next 16)                                      (Batch 2a)
P1-02 (tokens + split) → P1-07 (type re-tune)        (Batch 2b, after 2a)
P1-03 (detail pages) → P1-04 (index) → P1-05 (a11y) → P1-06 (images) → P1-08 (SEO)   (Batch 3)
P1-09 (CI) + P1-10 (tests)                           (Batch 3 in parallel branch; can start right after Batch 1)
P1-11, P2-01, P2-02, P2-03, P2-06, P2-07             (Batch 4)
P2-04, P2-05 (need Paul's content answers)           (Batch 5)
P3-*                                                 (only if credits remain)
```

Rules: tokens before contrast fixes; font fix before any typography tuning; the Next 16 upgrade before the big refactor (so the refactor is done once on the final framework); content changes last and only with Paul's facts.

---

## 7. Major decisions and tradeoffs

| Decision | Keep / Change | Why |
|---|---|---|
| Framework | Keep Next.js; upgrade 14.1 → 14.2 → 16 | Static App Router site; migration cost is three `params` awaits and ESLint config. Staying on 14 is not an option (EOL). Alternatives (Astro) would be a rewrite for no user-visible gain. |
| Rendering | Keep SSG | No dynamic data; cheapest and fastest. |
| Content | Keep local TS modules; add a few typed fields | A CMS adds cost, an external dependency, and an auth surface for a single author. MDX only if blogging starts. |
| Styling | Keep Tailwind 3.4 + tokens; retire Sass | Sass surface is tiny and its `@import` is deprecated; Tailwind 4 would be a second migration in the same window with no visual payoff. Tokens are the real win. |
| Animation | Keep GSAP for the hero; consider CSS for the logo | Already paid for, works, reduced-motion fix needed. |
| Email | Keep Resend REST | Works; add abuse controls. SDK not needed. |
| Hosting | Keep Vercel | Zero-config, previews, analytics. Pin Node. |
| Tests | Add Vitest + Playwright, small | The site is small; a 20-test suite catches 90% of regressions. |
| Dark mode | Defer | Doubles design QA; not requested. |
