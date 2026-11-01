# 01 — Repository Assessment

Audit date: 2026-11-01
Repository: `prodriguez-portfolio-2024` (`https://github.com/prodriguez-dev/prodriguez-portfolio-2024`)
Branch audited: `master` at `c6bec99` (working tree clean)
Live site: `https://www.prodriguez.dev` (apex `prodriguez.dev` 308-redirects to `www`)

Everything in this document was verified from repository contents, read-only commands, or HTTP probes of the live site. Items marked **ASSUMPTION** or **UNVERIFIED** were not confirmed.

---

## 1. Stack summary (verified)

| Layer | Technology | Declared range | Installed | Notes |
|---|---|---|---|---|
| Framework | Next.js (App Router) | `14.1.3` (exact pin) | 14.1.3 | Next 14 line is end-of-life; see 02-TECHNICAL-AUDIT |
| UI runtime | React / React DOM | `^18` | 18.3.1 | |
| Language | TypeScript | `^5` | 5.9.3 | `strict: true`; `tsc --noEmit` passes clean |
| Styling | Tailwind CSS 3 + Sass | `^3.4.1` / `^1.77.0` | 3.4.19 / 1.99.0 | Tailwind utilities dominate; Sass used for reset, scaling mixins, a few legacy classes |
| Typography plugin | `@tailwindcss/typography` | `^0.5.12` | 0.5.19 | Used only on project detail pages (`prose`) |
| Animation | GSAP | `^3.12.5` | 3.15.0 | `SplitText` plugin used (free since GSAP 3.13) |
| Icons | react-icons | `^5.0.1` | 5.6.0 | `MdEmail`, `MdMenu`, `FiEye`, `FaArrowLeft/Right` |
| Utility | clsx | `^2.1.0` | 2.1.1 | |
| **Unused dep** | swiper | `^11.1.4` | 11.2.10 | Zero imports in `src/`; carries a critical advisory |
| **Unused dep** | react-reconciler | `^0.29.0` | 0.29.2 | Zero imports in `src/` |
| Fonts | `next/font/google` | n/a | n/a | Sofia Sans, Sofia Sans Condensed, Sofia Sans Extra Condensed; 9 weights × 2 styles each |
| Lint | ESLint 8 + `eslint-config-next` | `^8` / `14.1.3` | 8.57.1 | `next lint` passes clean |
| Format | Prettier + tailwind plugin | `^3.2.5` / `^0.5.13` | 3.8.3 / 0.5.14 | Two conflicting config files; see §7 |
| Package manager | npm (`package-lock.json` v3) | | npm 10.9.7 | Local Node v22.22.2; no `engines` field, no `.nvmrc` |
| Hosting | Vercel | | | `server: Vercel` response header; no `vercel.json`, no `.vercel/` link in repo |
| Email | Resend REST API (raw `fetch`) | | | `src/app/api/contact/route.ts`; no SDK dependency |

No database, no auth, no CMS runtime, no analytics, no error monitoring, no tests, no CI.

---

## 2. Repository inventory

- 116 tracked files, 189 commits, first commit 2024-03-19, last commit 2026-06-02.
- Live deployment cache age at probe time ≈ 151 days, consistent with a deploy on or about 2026-06-03.
- History shows a Prismic-CMS era followed by a "handoff redesign" (commit `f73b23f` "Implement portfolio handoff redesign") and migration to local content files.

```
.
├── .eslintrc.json            extends next/core-web-vitals
├── .prettierrc               { plugins: [prettier-plugin-tailwindcss] }   <- the one Prettier actually loads
├── .prettierrc.json          tabWidth 4, no semi, single quotes          <- shadowed, never applied
├── .stylelintrc.json         references configs that are not installed
├── .npmrc                    comment only
├── .vscode/                  Tailwind IntelliSense settings
├── README.md                 accurate high-level description; lists a "recommended next cleanup"
├── next.config.mjs           sassOptions (additionalData @import), CORS headers for /api/*
├── tailwind.config.ts        3 font-family tokens; typography plugin; no color tokens
├── postcss.config.js
├── tsconfig.json             strict, paths @/* -> src/*
├── package.json              4 scripts: dev, build, start, lint
├── scripts/export-prismic-content.mjs   one-time CMS export; imports @prismicio/client which is NOT installed (script is dead)
├── public/                   11 MB total
│   ├── Paul-Rodriguez-Resume.pdf
│   ├── og-image.jpg          byte-identical to the hero stage photo (1570×750)
│   ├── favicons, apple-touch-icon.png (actually a JPEG with .png extension)
│   ├── images/               2 large PNG photos (1.7 MB, 2.1 MB), avatars
│   ├── images/prismic/       45 exported CMS images, all referenced
│   ├── bg/abstract-pattern-1.svg, next.svg, vercel.svg, sounds/knock{1,2,3}.ogg   <- unreferenced
└── src/
    ├── app/
    │   ├── layout.tsx                 fonts, global metadata, Header/Footer
    │   ├── page.tsx                   home -> renderPhaseOnePage("home")
    │   ├── [uid]/page.tsx             about, projects, ai-workflows, silver-tech-help, contact (SSG)
    │   ├── contact/page.tsx           duplicate static route for contact (wins over [uid])
    │   ├── projects/[uid]/page.tsx    22 project detail pages (SSG)
    │   ├── blog/[uid]/page.tsx        0 entries; route exists but generates nothing
    │   ├── api/contact/route.ts       POST -> Resend
    │   ├── robots.ts, sitemap.ts, favicon.ico
    ├── components/
    │   ├── Header.tsx, NavBar.tsx, NameLogo.tsx, Footer.tsx
    │   ├── HeroMotion.tsx             client; GSAP + typewriter tagline
    │   ├── InteractiveSections.tsx    client; ExperienceAccordion, ProjectsExplorer
    │   ├── ContactForm.tsx            client; fetch -> /api/contact
    │   ├── Bounded.tsx, Button.tsx, Heading.tsx   used only by content-rendering.tsx
    │   ├── Avatar.tsx                 UNUSED
    │   └── ContentList.tsx            UNUSED
    ├── content/
    │   ├── projects.ts                1,419 lines; 22 ContentEntry objects exported from Prismic
    │   └── blog.ts                    empty array
    ├── hooks/usePrefersReducedMotion.tsx   used only by the unused Avatar
    ├── lib/
    │   ├── phase-one-pages.tsx        1,282 lines: ALL page copy + ALL section components + metadata
    │   ├── site-content.ts            siteSettings, nav, social links, per-page meta defaults
    │   ├── content-types.ts           ContentEntry / slice types
    │   ├── content-data.ts            lookups
    │   ├── content-rendering.tsx      project/blog detail renderer (legacy dark theme)
    │   └── metadata.ts                title/description/OG helpers; SITE_URL constant
    ├── scss/                          reset, variables, mixins (sP scaling), functions, globals
    └── utils/formatDate.tsx
```

---

## 3. Architecture (verified)

**Rendering model.** Fully static. `next build` output: 35 prerendered pages; only `/api/contact` is a Node.js serverless function. No ISR, no middleware, no server actions, no remote images.

**Routing.**

| Route | Source | Generation | Count |
|---|---|---|---|
| `/` | `app/page.tsx` | static | 1 |
| `/about`, `/projects`, `/ai-workflows`, `/silver-tech-help`, `/contact` | `app/[uid]/page.tsx` via `generateStaticParams` | SSG | 5 |
| `/contact` | `app/contact/page.tsx` | static (shadows the `[uid]` version) | 1 |
| `/projects/[uid]` | `app/projects/[uid]/page.tsx` | SSG | 22 |
| `/blog/[uid]` | `app/blog/[uid]/page.tsx` | SSG | 0 |
| `/api/contact` | route handler | dynamic | 1 |
| `/robots.txt`, `/sitemap.xml` | metadata routes | static | 2 |

`dynamicParams` is not set on `[uid]` routes, so unknown slugs are rendered on demand and then 404 via `notFound()`.

**Content model.** Two parallel systems:
1. `src/lib/phase-one-pages.tsx` — a `pages` record keyed by uid holding typed section data (hero, stats, services, biography, experience, skills, references, contact, etc.) and the React section components that render them, in one file.
2. `src/content/projects.ts` — Prismic-shaped `ContentEntry[]` (tags, description blocks, slices: text / image / navigation) rendered by `src/lib/content-rendering.tsx`.

A third layer in `phase-one-pages.tsx` (`projectCategoryMap`, `featuredAwardUids`, `projectListOrder`, `latestProjects`) decorates the project data for the home and `/projects` pages. Only 14 of the 22 projects are in `projectListOrder`.

**Client/server split.** Six client components (`"use client"`): `HeroMotion`, `InteractiveSections`, `ContactForm`, `NavBar`, `Avatar` (unused), `ContentList` (unused). `NameLogo` has no directive but is only imported from the client `NavBar`, so it works. Everything else is a server component.

**Bundle (from `next build`, 2026-11-01).**

| Route | Route size | First Load JS |
|---|---|---|
| `/`, `/[uid]`, `/contact` | ~147 B | 129 kB |
| `/projects/[uid]`, `/blog/[uid]` | 188 B | 96.3 kB |
| Shared by all | | 84.3 kB |

GSAP ships in the shared layout chunk because `NavBar` → `NameLogo` imports `gsap` + `SplitText`.

**Styling.** Tailwind utilities with heavy use of arbitrary values (`text-[#c4621a]`, `rounded-[20px]`, `shadow-[0_2px_16px_rgba(0,0,0,0.05)]`). There are no color, radius, or shadow tokens in `tailwind.config.ts`; the palette lives as ~15 hex literals repeated across ~200 class strings. Sass contributes a reset, a viewport-scaling mixin (`sP()`), and a handful of legacy classes, most of which are no longer referenced.

**Metadata.** Root layout sets `metadataBase`, title template, OpenGraph, Twitter card, canonical, icons. Each page/project overrides title, description, canonical, OG, Twitter. `silver-tech-help` is `noindex, nofollow` and excluded from the sitemap.

**Environment variables (names only; no values present in repo).** `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM`. No `.env*` files exist locally. **UNVERIFIED:** whether these are set on Vercel. The live `/api/contact` endpoint responds to malformed input with the expected 400, so the route is deployed, but a real send was not attempted.

---

## 4. Build, quality gates, and tooling (verified)

| Check | Result |
|---|---|
| `npx tsc --noEmit` | exit 0, no errors |
| `npx next lint` | no warnings or errors |
| `npx next build` | success; 35 static pages; Browserslist "caniuse-lite is 7 months old" warning |
| `npx prettier --check src/**` | 21 files would change (config drift; see §7) |
| `npm audit` (all) | 32 vulnerabilities: 16 moderate, 14 high, 2 critical |
| `npm audit --omit=dev` | 6 vulnerabilities: 4 high, 2 critical (next 14.1.3, nested postcss, source-map-js, swiper) |
| Tests | none exist |
| CI | none (`.github/` absent) |
| Deployment config | none in repo; Vercel Git integration **ASSUMED** |

---

## 5. Live site probe (2026-11-01, read-only)

- `GET https://www.prodriguez.dev/` → 200, `server: Vercel`, `x-vercel-cache: HIT`, `strict-transport-security: max-age=63072000`.
- Security headers absent: `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`/`frame-ancestors`.
- `access-control-allow-origin: *` is present on the HTML document (platform default, harmless for a static page).
- `/robots.txt` and `/sitemap.xml` match the source; sitemap lists 5 pages + 22 projects with a single build-time `lastmod`.
- `/projects/larkin-hoffman` → 200 (33 KB HTML, 0.38 s TTFB from WSL).
- Compiled production CSS contains `.font-\[var\(--font-sofia-sans-extra-condensed\)\]{font-weight:var(--font-sofia-sans-extra-condensed)}` — this confirms the typography defect described in 02-TECHNICAL-AUDIT §F-01 is live.

---

## 6. External integrations

| Integration | Where | Status |
|---|---|---|
| Resend (email) | `api/contact/route.ts` | Raw REST; key via env; **UNVERIFIED** in production |
| Google Fonts | `next/font/google` | Self-hosted at build; no runtime third-party request |
| GitHub / LinkedIn | links only | `https://github.com/prodriguez-dev`, `https://www.linkedin.com/in/prodriguez-dev/` |
| Prismic | `scripts/export-prismic-content.mjs` | Legacy; dependency not installed; script cannot run |
| Vercel | hosting | No config in repo; project settings (Node version, env vars, domains) live in the dashboard |

---

## 7. Conventions and documentation state

- Code style in practice: 2-space indent, semicolons, double quotes, trailing commas. `.prettierrc` (which Prettier loads) only registers the Tailwind plugin, so these defaults apply. `.prettierrc.json` declares the opposite (4-space, no semi, single quotes) and is ignored because `.prettierrc` has precedence. Delete `.prettierrc.json`.
- `.stylelintrc.json` extends `stylelint-config-standard` and `stylelint-scss`, neither of which is installed; `stylelint-config-prettier` is deprecated for Stylelint ≥15. Stylelint is effectively not usable.
- `tailwind.config.ts` `content` globs include `./src/pages/**` and `./src/slices/**`, which do not exist (harmless).
- `next.config.mjs` `sassOptions.includePaths` points at `./styles`, which does not exist (harmless; `additionalData` carries the variable/mixin imports).
- README is accurate about the content model and already lists "upgrade Next.js to a patched release" as the top cleanup item.
- No `CLAUDE.md` or `AGENTS.md` in the repo. The parent directory `~/CLAUDE.md` governs Paul's home, not this project.
- Related Obsidian context (read-only): `Projects Overview.md` identifies prodriguez.dev as the **companion site** to a planned smartcodeshop.com rebuild, with audience "résumé-checkers (recruiters, hiring managers, senior buyers)" and the rule that **job-search signal lives privately on LinkedIn, not on this public site.** `About Paul.md` lists target roles: Solutions Architect, Sales Engineer, Presales, Developer Relations, Field Engineer, Value Architect, Technical GTM. `Writing Style.md`: direct, practical, short paragraphs, no em dashes.

---

## 8. Things that are fine and should be kept

- App Router + static generation is the right architecture for this site. No migration of rendering strategy is warranted.
- Local TypeScript content (no CMS) is the right call for a single-author portfolio; it is versioned, typed, and free.
- `next/font` self-hosting, `next/image`, metadata API, `robots.ts`, `sitemap.ts` are all correctly wired.
- Type checking and lint are clean; the codebase is small (≈3,700 lines of TS/TSX excluding content) and easy to refactor.
- The warm light palette, condensed display typography intent, and card system from the handoff redesign are a sound visual direction; they need tokenization and consistency, not replacement.
