# 07 — Claude Cloud Implementation Master Prompt

Copy everything below the line into a new Claude Cloud session on the `prodriguez-portfolio-2024` repository. Add one line at the very end stating which batch to run (see §9). Keep the prompt text identical across sessions so the prefix caches.

---

# Portfolio Modernization: Implementation Agent Instructions

You are the implementation agent for the modernization of `prodriguez-portfolio-2024`, Paul Rodriguez's personal portfolio at `https://www.prodriguez.dev`. An audit has already been completed and lives in `docs/modernization-audit/` (files 01–08). **Do not repeat discovery.** Read `01-REPOSITORY-ASSESSMENT.md` and `08-EXECUTION-CHECKLIST.md` first, then only the files your batch names. Consult `02`–`05` for the reasoning behind a task when you need it.

## 1. Verified architecture (as of 2026-11-01, commit `c6bec99`)

- Next.js 14.1.3 App Router, React 18.3, TypeScript 5.9 (strict), Tailwind 3.4 + Sass 1.99, GSAP 3.15, react-icons, clsx. npm. Hosted on Vercel; apex redirects to `www`.
- Fully static: 35 prerendered pages; one Node route handler `src/app/api/contact/route.ts` posting to the Resend REST API using env vars `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM` (names only; never print values).
- Routes: `/` (`app/page.tsx`), `/about` `/projects` `/ai-workflows` `/silver-tech-help` `/contact` (`app/[uid]/page.tsx` + duplicate `app/contact/page.tsx`), `/projects/[uid]` (22 entries), `/blog/[uid]` (0 entries), `robots.ts`, `sitemap.ts`.
- Content: `src/lib/phase-one-pages.tsx` (1,282 lines: page copy, section types, 20 section components, metadata, renderer), `src/lib/site-content.ts` (site settings, nav), `src/content/projects.ts` (22 `ContentEntry` objects, 1,419 lines), `src/lib/content-rendering.tsx` (project detail renderer, legacy dark theme), `src/lib/metadata.ts`, `src/lib/content-types.ts`, `src/lib/content-data.ts`.
- Components: `Header`, `NavBar` (client), `NameLogo` (GSAP SplitText), `Footer`, `HeroMotion` (client, GSAP), `InteractiveSections` (client: `ExperienceAccordion`, `ProjectsExplorer`), `ContactForm` (client), `Bounded`/`Button`/`Heading` (detail pages only), `Avatar` and `ContentList` (unused).
- Styling: Tailwind arbitrary values with ~15 repeated hex literals; no color/radius/shadow tokens; `tailwind.config.ts` defines `fontFamily.sans`, `sans-condensed`, `sans-extra-condensed`. Sass provides `reset.scss`, `variables/mixins/functions` (an `sP()` fluid-scaling mixin), and `globals.scss` with mostly dead classes.
- Quality gates today: `tsc --noEmit` clean, `next lint` clean, `next build` succeeds, no tests, no CI, `npm audit --omit=dev` = 6 vulnerabilities (next 14.1.3, nested postcss, source-map-js, unused swiper).

## 2. Verified defects you are fixing (short list; details in `02-TECHNICAL-AUDIT.md`)

- **F-06 (critical, visual):** every `font-[var(--font-sofia-sans-extra-condensed)]` / `font-[var(--font-sofia-sans-condensed)]` class compiles to `font-weight: var(...)`, which is invalid, so no display text renders in the condensed fonts. Use the existing theme classes `font-sans-extra-condensed` / `font-sans-condensed`.
- **F-01/F-02:** Next 14.1.3 is EOL with advisories; `swiper` and `react-reconciler` are unused.
- **F-07:** `content-rendering.tsx` renders project pages in a dark gray theme unlike the rest of the site.
- **F-08:** `/projects` never links to `/projects/[uid]`; 8 of 22 projects are orphaned (`ice-miller`, `wilson-elser`, `robinson-cole`, `ub-greensfelder`, `patterson-belknap`, `five-seasons-windows`, `rhyme-on-a-dime`, `windy-city-classics`).
- **F-23/F-24:** no security headers beyond HSTS; contact API leaks provider error text and has no abuse controls.
- **Contrast failures:** `#7a7570` on `#f4f1eb`/`#ede9e1`, `#c4621a` text on light surfaces, white text on `#c4621a` buttons, `#d55c45` error text.
- **A11y:** no skip link; accordion/filter buttons lack `aria-expanded`/`aria-pressed`; form inputs lack ids/names/`aria-describedby`/`aria-invalid`/live region; input focus outline removed in `reset.scss`; `HeroMotion` ignores reduced motion; `/projects` and `/ai-workflows` have no `h1`; Unicode glyphs used as icons.
- **Images:** 6 `fill` images without `sizes`; wrong declared dimensions for hero images; two 1.7–2.1 MB PNG photos; OG image is the hero photo.
- **Hygiene:** 54 `@font-face` declarations; Sass `@import` deprecated; dead code and unused assets; two conflicting Prettier configs; broken Stylelint config; Node version unpinned.

## 3. Desired end state

A deployable, visually consistent portfolio on a supported Next.js major with: the intended condensed display typography actually rendering; a tokenized theme with every text/background pair ≥ 4.5:1; project case-study pages in the same light design as the rest of the site and reachable from a `/projects` grid; WCAG 2.2 AA fixes applied; security headers and a hardened contact form; CI running typecheck, lint, unit tests, build, and a Playwright smoke suite; clean dependencies; accurate README and design docs. No new facts in copy, no CMS, no dark mode, no new animation libraries.

## 4. Non-negotiable rules

1. **Verify before modifying.** At session start run `git status`, `git log -1`, `node -v`, `npm ci` (if `node_modules` is absent), and `npm run build`. If the tree is dirty or the build fails before you change anything, stop and report.
2. **Work on a branch per batch** named `modernize/<batch>`; never commit to `master`. Open a PR at the end of the batch with task IDs, evidence, and deferred items. End commit messages with the attribution line provided by the session environment.
3. **Scope is the checklist.** Only tasks assigned to your batch. Log anything else under "Proposed follow-ups" in `08-EXECUTION-CHECKLIST.md`.
4. **Preserve functionality.** Refactors must not change rendered text. Capture visible text of `/`, `/about`, `/projects`, `/projects/american-national-annuity-application`, `/ai-workflows`, `/contact` before and after and diff them. URL set changes only with a logged decision and `redirects()` entries for removed URLs. The contact API keeps its request/response contract.
5. **No invented content.** You may restructure and shorten existing copy. You may not add achievements, metrics, titles, employers, dates, client names, or testimonial attributions that are not already in the repo or explicitly supplied by Paul in the checklist's "Paul's answers" section. Where content is missing, leave a `TODO(paul):` comment in the content file and list it in the checklist.
6. **Never print secrets.** Env vars by name only. Do not create `.env` files with values.
7. **Minimal dependencies.** Allowed additions: `vitest`, `@vitejs/plugin-react` (if needed), `@playwright/test`, `@axe-core/playwright`, `@vercel/analytics`, `@vercel/speed-insights`, `eslint@9` with `eslint-config-next` (flat), `@types/react@19`/`@types/react-dom@19` with the Next 16 upgrade. Anything else requires a logged decision with justification.
8. **Gate after every task:** `npm run typecheck && npm run lint && npm run build` (add the `typecheck` script in Batch 1 if missing: `tsc --noEmit`). Do not proceed on red.
9. **Update the checklist as you go**, not at the end. Each task gets: status, one-line evidence per acceptance criterion (command and result), and the commit hash.
10. **Stop and ask Paul only when** an action is destructive or irreversible (deleting public URLs, force-pushing, changing Vercel settings), when a decision changes the information architecture and no default is given, or when a task needs assets or facts only Paul has. Otherwise choose the documented default, log it in `DECISIONS.md`, and continue.

## 5. Decision defaults (use these unless Paul's answers in the checklist say otherwise)

- Tier 3 projects: keep all 22 pages; show Tier 3 in a compact "Archive" list on `/projects`.
- Honeypot handling: respond `200 {ok:true}` and drop the message silently.
- CSP: ship `Content-Security-Policy-Report-Only` first; switch to enforcing only after a clean preview check is recorded.
- Primary button style: `bg-accent-text` (`#9c470d`) with white text.
- Node: `engines >=22 <25`, `.nvmrc` `22`.
- Analytics: add Vercel Analytics + Speed Insights.
- Blog route: keep dormant, document in README.
- `silver-tech-help`: keep, unlisted, `noindex`.
- Testimonials with vague roles: keep as-is until Paul supplies attributions; do not change roles.
- Hero secondary CTA: leave pointing at `/ai-workflows`; rebuild that page in Batch 5.

## 6. Design and code standards

- **Tokens (Batch 2b):** colors `surface #f4f1eb`, `surface-alt #ede9e1`, `card #ffffff`, `line #e0dbd0`, `line-strong #cfc8ba`, `line-input #8f887c`, `ink #111111`, `ink-soft #4d4a45`, `ink-muted #67625c`, `accent #c4621a`, `accent-text #9c470d`, `hero #1a1610`, `danger #b23a26`; radii `card 16px`, `card-lg 20px`, `panel 24px`, `btn 10px`, `pill 9999px`; shadows `card: 0 2px 16px rgba(0,0,0,.05)`, `card-hover: 0 8px 32px rgba(0,0,0,.10)`; font roles `font-display` (Extra Condensed), `font-label` (Condensed), `font-sans`. Implement colors as CSS custom properties on `:root` consumed by `theme.extend.colors` so a future dark mode is a variable swap. Commit `scripts/check-contrast.mjs` that asserts every text-on-surface pair ≥ 4.5:1 and `line-input` on input backgrounds ≥ 3:1, and run it in CI.
- **Type scale:** body 16/17/18 px; labels 13–14 px uppercase tracked; display `display-sm/md/lg` as `clamp()` tokens defined once. No new `text-[Npx]` literals after Batch 2b.
- **Components:** server components by default; `"use client"` only where state/effects exist. One `Section` and one `Card` component with variants replace repeated class strings. Props typed; no `any`. Decorative icons are `react-icons` SVGs with `aria-hidden`.
- **Motion:** every transform/animation wrapped in `motion-safe:` or guarded by `prefers-reduced-motion`; GSAP timelines skip to the final state when reduced motion is on.
- **Accessibility:** one `h1` per page; skip link to `#main`; `aria-expanded`/`aria-controls` on disclosures; `aria-pressed` on toggle filters; form fields with `id`, `name`, `autocomplete`, `aria-describedby` for errors, `aria-invalid`, `role="alert"` for submit errors, focus moved to the success heading; visible `focus-visible` ring on all interactive elements.
- **Content files:** data only, typed, no JSX. Section components receive typed props.
- **Formatting:** 2 spaces, semicolons, double quotes, trailing commas (the repo's actual style). One Prettier config.
- **Commits:** small, task-scoped, message starts with the task ID (`P0-03: use theme font classes for display type`).

## 7. Implementation sequence and acceptance criteria

Execute only your assigned batch. Full acceptance criteria and validation commands are in `05-MODERNIZATION-ROADMAP.md` and `08-EXECUTION-CHECKLIST.md`; the essentials:

**Batch 1 (`modernize/p0`): P0-01 → P0-06.** Bump Next to latest 14.2.x and matching `eslint-config-next`; uninstall `swiper`, `react-reconciler`; `npm audit fix` (no force); replace the broken font classes; add security headers and remove the dead CORS block in `next.config.mjs`; add `src/lib/contact-validation.ts` shared by form and route, honeypot + 3-second minimum, generic error messages, `runtime="nodejs"`, `maxDuration=10`; add `engines`, `.nvmrc`, `typecheck` script; tag `pre-modernization` at `c6bec99`. Done when: `npm audit --omit=dev` has no next/swiper advisories; `grep -c "font-weight:var(--font-sofia" .next/static/css/*.css` is 0; `curl -I` on the preview shows the headers; validator unit test passes; build is green.

**Batch 2a (`modernize/next16`): P1-01.** `npx @next/codemod@canary upgrade latest`; `await params` in the three `[uid]` pages (page and `generateMetadata`); ESLint 9 flat config; React 19 types; remove `suppressHydrationWarning`; confirm Sass works under Turbopack. Done when: route table identical to the audit (35 pages), typecheck/lint/build green, no console errors on five pages, visible-text diff empty.

**Batch 2b (`modernize/tokens`): P1-02, P1-07, P1-11.** Tokens as in §6; contrast script; replace all hex/radius/shadow literals; split `phase-one-pages.tsx` into `src/content/pages/*.ts` + `src/content/page-types.ts` + `src/components/sections/*.tsx` + `src/lib/pages.ts` as a pure move; re-tune display clamps and spacing with screenshots at 390/768/1280/1920; trim font weights. Done when: no 6-digit hex in `src/components|lib|app` outside token definitions; contrast script green; visible-text diff empty; screenshots show no clipping; `@font-face` count ≤ 14.

**Batch 3-tests (`modernize/ci`): P1-09, P1-10.** Vitest (metadata helpers, content-data, contact validation, page data integrity) and Playwright (all sitemap URLs 200 with exactly one `h1`, nav desktop/mobile, contact validation, axe on five pages, screenshots at four widths); GitHub Actions on PR/push. Done when: CI green on the PR in < 5 minutes.

**Batch 3-ui (`modernize/ui`): P1-03 → P1-06, P1-08.** Case-study template in the light system (header, summary bullets, outcome callout when data exists, slices, image cards, stack tags, prev/next from `projectListOrder`, CTA); optional `ContentEntry` fields `role`, `summary`, `outcome`, `stack`, `tier` populated only from existing text; `/projects` card grid with "Read case study" links, categories derived from data, Tier 3 archive list; accessibility fixes listed in §2; `sizes` on all `fill` images, corrected dimensions, optimized JPEG/WebP for the two PNG photos, real `apple-touch-icon.png`, a 1200×630 OG image (text: name + role); JSON-LD `Person`/`WebSite`/`CreativeWork`; single `SITE_URL` in `src/lib/site.ts`; `manifest.ts`; `themeColor`. Done when: every project page has an inbound link; axe serious/critical = 0 on five pages; Lighthouse mobile on preview ≥ 90 performance and 100 accessibility; Rich Results test passes for `Person`.

**Batch 4 (`modernize/cleanup`): P2-01, P2-02, P2-03, P2-06, P2-07.** Delete dead code/assets/configs; one Prettier config + `format:check`; retire Sass into `src/styles/globals.css` with Tailwind clamp utilities; README + `docs/DESIGN.md` + repo `CLAUDE.md`; Vercel Analytics + Speed Insights. Done when: no `.scss`; `prettier --check` green; README lets a new contributor add a project.

**Batch 5 (`modernize/content`): P2-04, P2-05.** Only with Paul's answers recorded in the checklist. Hero/stats rewrite from existing facts; "How I work" section; AI Workflows page with `h1`, grid, links to the WIK case study and GitHub repo, CTA; Great Jakes consolidation; `summary`/`outcome` for Tier 1/2; resume date label; `Section`/`Card` consolidation; stats band and featured-card refinement. Done when: every new sentence is traceable to existing text or Paul's answers; Paul signs off on the PR.

**Batch 6 (final verification, on a release branch):** walk every acceptance criterion in `08`, run the full test suite and Lighthouse, confirm the sitemap URL set against the live site, produce a deployment-readiness report in `docs/modernization-audit/09-VERIFICATION-REPORT.md` (what passed, what was deferred, exact rollback command), and open the release PR.

## 8. Progress tracking across sessions

- `docs/modernization-audit/08-EXECUTION-CHECKLIST.md`: update status (`todo` / `in-progress` / `done` / `blocked` / `deferred`), evidence, commit hash, and the batch/session that did it. This is the only progress record.
- `docs/modernization-audit/DECISIONS.md`: create on first use; one dated line per judgment call with the reason and how to reverse it.
- PR descriptions list task IDs and link to checklist lines.
- When resuming, read the checklist's "Current state" block first; it must be updated at the end of every session with: branch, last commit, next task, blockers.

## 9. Starting a session

State which batch you are running, verify the repository as in §4.1, create or check out the batch branch, and begin with the first `todo` task for that batch in `08-EXECUTION-CHECKLIST.md`. If a prerequisite batch is not merged, stop and say so.

RUN BATCH: <fill in: 1 | 2a | 2b | 3-tests | 3-ui | 4 | 5 | 6>
