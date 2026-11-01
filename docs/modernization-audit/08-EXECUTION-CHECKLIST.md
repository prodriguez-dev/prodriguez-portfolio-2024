# 08 — Execution Checklist

This file is the single progress tracker. Execution sessions update it as they work. Status values: `todo`, `in-progress`, `done`, `blocked`, `deferred`.

## Current state

- Branch: `claude/magical-hawking-b6qg2s` (Batch 1; see DECISIONS.md) · Last task commit: `e12ec80` · Updated 2026-11-01 (Batch 1 session).
- Batch 1: P0-00 to P0-06 done locally; B1-PR open items are the preview `curl -I`, the live CSS grep after deploy, and Paul confirming Vercel env vars and Node version (answer 7).
- Next task: B1-PR (open PR, Vercel preview checks, merge). Then Batch 2a (P1-01, Next 16), which is now the only way to clear the remaining 25 `next` advisories (see P0-01).
- Blockers: none for code. The `pre-modernization` tag could not be pushed from the cloud session (see P0-00); Paul pushes it. Paul's answers (below) are needed before Batch 3-ui orphan handling (default exists) and Batch 5.

## Paul's answers (fill in; agents treat blank as "use the default in 07 §5")

| # | Question | Answer |
|---|---|---|
| 1 | Testimonial attributions (title, company, permission) for Eric Ma, Robert Algeri, Jon Traister, Chris Hegg, Jamie H. Phillips | |
| 2 | Tier 3 projects to keep / archive / delete (8 orphans + 2 school projects) | |
| 3 | Approve hero body rewrite and stats selection (existing facts only; see 04 §1) | |
| 4 | Role title for American National and WIK case studies | |
| 5 | Resume PDF current? Date to display? | |
| 6 | Image assets: sharper standing cutout; DISH microsite / Domo / banners screenshots; OG image preference | |
| 7 | Vercel: Node version set; `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM` present; Resend sending domain verified; Git integration + previews enabled | |
| 8 | Keep `/silver-tech-help` unlisted? | |
| 9 | Add Vercel Analytics + Speed Insights? | |
| 10 | Twitter/X handle for metadata (optional) | |

## Decision log

Create `DECISIONS.md` in this directory on first judgment call. Reference entries here by date.

---

## Batch 1 — P0 (`modernize/p0`)

| ID | Task | Status | Acceptance criteria | Evidence | Commit |
|---|---|---|---|---|---|
| P0-00 | Tag `pre-modernization` at `c6bec99`; add `typecheck` script | done | tag exists; `npm run typecheck` works | `git tag -l -n1` → `pre-modernization` at c6bec99 (annotated). **Tag push blocked**: this cloud session can only push its own branch; Paul to run `git tag -a pre-modernization c6bec99 -m "Rollback anchor before modernization" && git push origin pre-modernization`. `npm run typecheck` exit 0. Also fixed pre-existing `npm ci` failure (lock missing `yaml@2.9.1`); `rm -rf node_modules && npm ci` now green. B1 session. | a465606, ce3d3bb |
| P0-01 | Next.js → latest 14.2.x; `eslint-config-next` to match | done (criterion partially met) | `npm audit --omit=dev` has no `next`/`postcss` advisories; build generates 35 pages | `next@14.2.35`, `eslint-config-next@14.2.35` (exact pins; 14.2.35 is the last 14.x). Build: 35/35 pages. **Criterion not met on 14.x:** `next` advisories 36 → 25; all remaining are patched only in ≥15.5, and the nested `postcss` is pinned by `next`. Cleared: 12 incl. critical GHSA-f82v-jwr5-mffw. Deferred to P1-01; see DECISIONS.md. B1 session. | 5a348c1 |
| P0-02 | Remove `swiper`, `react-reconciler`; `npm audit fix`; update browserslist DB | done (criterion partially met) | 0 critical in `npm audit --omit=dev`; build green | No imports of either package in `src/`. `npm audit --omit=dev`: 6 (4 high, 2 critical) → 2 (1 high, 1 critical); remaining = `next` (critical, needs ≥15.5) and its nested `postcss`. swiper, immutable, nanoid, source-map-js cleared. `update-browserslist-db` → no Browserslist warning in build. Build green. B1 session. | 2ce88c9 |
| P0-03 | Replace `font-[var(--font-sofia-sans-*)]` with `font-sans-extra-condensed` / `font-sans-condensed`; remove `.sofia-*` SCSS | done | `grep -c "font-weight:var(--font-sofia" .next/static/css/*.css` = 0; screenshots at 390/768/1280/1920 show condensed type, no clipping | 20 replacements in 6 files. Compiled CSS: `font-weight:var(--font-sofia` count 0; `.font-sans-extra-condensed{font-family:var(--font-sofia-sans-extra-condensed)}` present. Playwright screenshots on 6 pages × 4 widths show condensed display type; DOM check found no clipped headings and no new horizontal overflow. Visible-text diff empty on 6 pages. Pre-existing 688 px overflow at 390 on project pages (legacy renderer) logged under follow-ups for P1-03. B1 session. | b2d0e48 |
| P0-04 | Security headers; remove dead CORS block | done locally; preview check in B1-PR | `curl -I <preview>` shows nosniff, referrer-policy, permissions-policy, frame options, CSP-Report-Only; no console CSP violations on all pages | `curl -I localhost:3100/` (next start) shows all five headers; `OPTIONS /api/contact` returns no `Access-Control-*`. Chromium crawl of 27 sitemap URLs + `/silver-tech-help`: 0 CSP report-only violations, 0 console errors; a planted off-origin `<img>` was detected (negative control). Preview `curl -I` pending. B1 session. | 528e558 |
| P0-05 | Contact hardening: shared validator, honeypot, 3 s minimum, generic errors, runtime/maxDuration | done | validator unit tests pass; curl: `{}` → 400, honeypot → 200 silent, valid → 200/503 per env; no provider text in responses | `npm test`: 18/18 (validator + route with mocked fetch; provider 401 body not echoed). curl on `next start` without key: `{}` 400, bad JSON 400, bad email 400, unknown subject 400, honeypot 200 `{ok:true}`, elapsedMs 1200 → 200, valid → 503 generic, 20k body → 413. Browser: empty-submit messages unchanged; honeypot off-screen, `aria-hidden`, not in tab order; valid submit sends `elapsedMs` ≥ 3000. Visible-text diff empty. Live 200 path needs the Vercel env (Paul, answer 7). B1 session. | d410d02 |
| P0-06 | `engines`, `.nvmrc`, README deployment note | done | `npm ci` on Node 22 green; README updated | `engines.node` `>=22 <25`, `.nvmrc` `22`. `rm -rf node_modules && npm ci` on Node v22.23.4: green, no EBADENGINE. README: requirements, scripts, Vercel settings, env var names, rollback. Paul to confirm Node 22.x in Vercel. B1 session. | e12ec80 |
| B1-PR | Open PR, merge, deploy; verify live headers and compiled CSS | todo | live `curl -I` and CSS grep recorded here | | |

## Batch 2a — Next 16 (`modernize/next16`)

| ID | Task | Status | Acceptance criteria | Evidence | Commit |
|---|---|---|---|---|---|
| P1-01a | Run codemod; React 19; `@types/react*@19` | todo | install clean | | |
| P1-01b | `await params` in `[uid]`, `projects/[uid]`, `blog/[uid]` (page + metadata) | todo | typecheck green | | |
| P1-01c | ESLint 9 flat config replacing `next lint` | todo | `npm run lint` green | | |
| P1-01d | Remove `suppressHydrationWarning`; verify Sass under Turbopack | todo | no hydration warnings in dev console on 5 pages; build green | | |
| P1-01e | Route table identical (35 pages); visible-text diff empty on 6 pages | todo | diff output recorded | | |
| B2a-PR | PR with screenshots; merge | todo | | | |

## Batch 2b — Tokens, split, type tune (`modernize/tokens`)

| ID | Task | Status | Acceptance criteria | Evidence | Commit |
|---|---|---|---|---|---|
| P1-02a | Tokens in `tailwind.config.ts` + CSS variables; `scripts/check-contrast.mjs` | todo | script asserts every text/surface pair ≥ 4.5:1 and passes | | |
| P1-02b | Replace hex/radius/shadow literals across components | todo | `grep -rn "#[0-9a-fA-F]\{6\}" src/components src/lib src/app` → only token definitions | | |
| P1-02c | Split `phase-one-pages.tsx` → `src/content/pages/*.ts`, `page-types.ts`, `components/sections/*.tsx`, `lib/pages.ts` | todo | visible-text diff empty on 6 pages; build green | | |
| P1-07 | Display clamp tokens; body/label scale; section spacing; remove marquee + mobile-only pill rows; hero wrap check | todo | screenshots at 4 widths, no overflow; `docs/DESIGN.md` type-scale table | | |
| P1-11 | Trim font weights | todo | `@font-face` count ≤ 14 in compiled CSS; screenshots unchanged | | |
| B2b-PR | PR; merge | todo | | | |

## Batch 3-tests — CI and tests (`modernize/ci`)

| ID | Task | Status | Acceptance criteria | Evidence | Commit |
|---|---|---|---|---|---|
| P1-10a | Vitest: metadata helpers, content-data, contact validation, page data integrity | todo | `npm test` green | | |
| P1-10b | Playwright: sitemap URLs 200 + one `h1`, nav desktop/mobile, contact validation, axe on 5 pages, screenshots at 4 widths | todo | `npm run test:e2e` green locally | | |
| P1-09 | `.github/workflows/ci.yml`: typecheck, lint, test, build, e2e; scripts added | todo | CI green on PR in < 5 min | | |
| B3t-PR | PR; merge; Paul enables required checks | todo | | | |

## Batch 3-ui — Case studies, index, a11y, images, SEO (`modernize/ui`)

| ID | Task | Status | Acceptance criteria | Evidence | Commit |
|---|---|---|---|---|---|
| P1-03a | `ContentEntry` optional fields `role`, `summary`, `outcome`, `stack`, `tier`; populate Tier 1/2 from existing text; `TODO(paul)` elsewhere | todo | typecheck green; no invented facts | | |
| P1-03b | Case-study template in light system; prev/next from `projectListOrder`; CTA; delete `content-rendering.tsx` legacy styles | todo | no `bg-gray-900` in src; 22 pages build; axe clean on one project page | | |
| P1-04 | `/projects` card grid linking to case studies; categories from data; Tier 3 archive list (default) | todo | every project page has ≥1 inbound link; `aria-pressed` on filters; sitemap and params agree | | |
| P1-05a | Skip link + `main#main`; NavBar Escape + focus return | todo | keyboard walkthrough recorded | | |
| P1-05b | `aria-expanded`/`aria-controls` on accordions; `aria-pressed` on filters | todo | axe | | |
| P1-05c | ContactForm: ids, names, autocomplete, `aria-describedby`, `aria-invalid`, live region, focus to success | todo | axe; manual SR check notes | | |
| P1-05d | Input `focus-visible` ring; HeroMotion reduced-motion + live text; `h1` on `/projects` and `/ai-workflows`; glyphs → `aria-hidden` SVG | todo | axe serious/critical = 0 on `/`, `/about`, `/projects`, one project, `/contact` | | |
| P1-06 | `sizes` on all `fill` images; fix dimensions; optimize PNG photos; real `apple-touch-icon.png`; 1200×630 OG image | todo | Lighthouse mobile LCP < 2.5 s; no image > 400 KB except hero; OG renders in a validator | | |
| P1-08 | `src/lib/site.ts` single URL; JSON-LD Person/WebSite/CreativeWork; `manifest.ts`; `themeColor`; sitemap `lastModified` from dates; hero bg `alt=""` | todo | Rich Results test passes; one `SITE_URL` definition | | |
| B3u-PR | PR with screenshots + Lighthouse; merge | todo | Lighthouse mobile ≥ 90 perf / 100 a11y recorded | | |

## Batch 4 — Cleanup and docs (`modernize/cleanup`)

| ID | Task | Status | Acceptance criteria | Evidence | Commit |
|---|---|---|---|---|---|
| P2-01 | Delete `Avatar`, `ContentList`, unused hook (or reuse), export script, `.prettierrc.json`, broken stylelint config, unused public assets, dead SCSS, marquee; document dormant blog | todo | build green; unreferenced-asset check empty | | |
| P2-02 | One Prettier config; `format:check` in CI; `.editorconfig`; clean Tailwind globs | todo | `prettier --check` green | | |
| P2-03 | Retire Sass → `src/styles/globals.css`; clamp utilities replace `global-text-*` | todo | no `.scss`; screenshots unchanged | | |
| P2-06 | README rewrite; `docs/DESIGN.md`; repo `CLAUDE.md` | todo | reviewer can add a project from README alone | | |
| P2-07 | Vercel Analytics + Speed Insights | todo | events visible after deploy (Paul confirms) | | |
| B4-PR | PR; merge | todo | | | |

## Batch 5 — Content and polish (`modernize/content`) — requires Paul's answers

| ID | Task | Status | Acceptance criteria | Evidence | Commit |
|---|---|---|---|---|---|
| P2-04a | Hero body + stats from existing facts (answer 3) | todo | every sentence traceable | | |
| P2-04b | "How I work" section from existing About paragraph | todo | | | |
| P2-04c | AI Workflows page: `h1`, grid, links to WIK case study + repo, CTA | todo | | | |
| P2-04d | Great Jakes consolidation (answer 2); Tier 1/2 `summary`/`outcome` | todo | | | |
| P2-04e | Testimonial attributions (answer 1); resume date (answer 5) | todo | | | |
| P2-05 | `Section`/`Card` consolidation; stats band; featured cards with outcome line; glyph icons | todo | no duplicated card class strings | | |
| B5-PR | PR; Paul signs off on copy diffs; merge | todo | | | |

## Batch 6 — Final verification

| ID | Task | Status | Evidence |
|---|---|---|---|
| V-01 | Every `done` row above re-verified on the release branch | todo | |
| V-02 | Full test suite + Lighthouse (mobile and desktop) on preview | todo | |
| V-03 | Live sitemap URL set: all 200; removed URLs redirect | todo | |
| V-04 | Security headers live; CSP switched to enforcing if clean | todo | |
| V-05 | `09-VERIFICATION-REPORT.md` written (passed, deferred, rollback: `git checkout pre-modernization` / Vercel instant rollback) | todo | |
| V-06 | Production deploy; Paul smoke-tests | todo | |

## Proposed follow-ups (P3, out of scope unless approved)

- (from Batch 1) Project detail pages overflow horizontally at 390 px (document 688 px wide); caused by the date/client row in `src/lib/content-rendering.tsx` (`div.col-span-1 mt-8 block md:ml-auto`). Pre-existing; fix within P1-03 when the template is rebuilt.
- (from Batch 1) Dev-only `npm audit` still reports advisories via `eslint-config-next@14` (glob, minimatch, postcss-selector-parser). Expected to clear with ESLint 9 / `eslint-config-next@16` in P1-01c; re-check there.
- (from Batch 1) `next/font/google` fetches fonts at build time and occasionally failed transiently in the cloud sandbox (`Cannot read properties of null (reading '1')` in the font loader); a rebuild succeeded. Consider `next/font/local` with committed WOFF2 files during P1-11 to make builds hermetic.

- P3-01 per-page OG images with `next/og`
- P3-02 MDX blog
- P3-03 SVG flow diagrams for American National / WIK case studies
- P3-04 dark mode via CSS-variable tokens
- P3-05 Tailwind 4 migration
- P3-06 View Transitions
- P3-07 logo hover effect in CSS; drop GSAP from the shared chunk
