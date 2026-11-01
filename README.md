# prodriguez-portfolio-2024

Personal portfolio site built with Next.js, TypeScript, local content modules, Tailwind, Sass, and GSAP.

## Stack

- Next.js 14.2
- React 18
- TypeScript
- Local TypeScript content files
- Tailwind CSS
- Sass
- GSAP

## Requirements

- Node.js 22 (`.nvmrc`; `package.json` `engines` allows `>=22 <25`)
- npm (use `npm ci` for a clean install from the lockfile)

## Getting started

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Open <http://localhost:3000>.

## Available scripts

- `npm run dev` - start local development server
- `npm run build` - create production build
- `npm run start` - run production build locally
- `npm run lint` - run Next.js linting
- `npm run typecheck` - run the TypeScript compiler without emitting
- `npm test` - run unit tests (Vitest)

## Content model

The site now uses local content files instead of Prismic runtime content.

Important areas:

- `src/lib/site-content.ts` - site settings and shared metadata inputs
- `src/lib/phase-one-pages.tsx` - local rendering/content for the core top-level pages
- `src/content/projects.ts` - local project detail content exported from the prior CMS
- `src/content/blog.ts` - local blog content source, currently empty
- `src/lib/content-data.ts` - content lookup and sorting helpers
- `src/lib/content-rendering.tsx` - shared rendering for local project/blog detail pages

## Project structure

```text
src/
  app/           App Router routes
  components/    shared UI components
  content/       local project/blog content
  lib/           metadata, local content, render helpers
  scss/          global Sass utilities and styles
  utils/         helper functions
```

## Notes

- The site no longer depends on Prismic runtime routes, preview plumbing, or Slice Machine simulator pages.
- Global site metadata is generated from local site settings in `src/app/layout.tsx`.
- Header and footer consume the shared local settings payload from the root layout.
- Project detail content is statically generated from local files.

## Deployment

Hosted on Vercel. Expected setup (confirm in the Vercel dashboard): Git integration on, `master` deploys to production, pull requests get preview deployments. The apex domain `prodriguez.dev` redirects to `https://www.prodriguez.dev`.

Vercel project settings to keep in sync with this repo:

- Node.js version: 22.x (matches `.nvmrc`; move to 24.x after the Next.js 16 upgrade).
- Install command: default (`npm install`) or `npm ci`; both work with the committed lockfile.
- Environment variables used by `src/app/api/contact/route.ts` (set in Vercel, never committed):
  - `RESEND_API_KEY` - required; without it the contact form responds 503.
  - `CONTACT_EMAIL_TO` - destination inbox (falls back to `paul@prodriguez.dev`).
  - `CONTACT_EMAIL_FROM` - sender on a Resend-verified domain (falls back to Resend's onboarding sender).

Security headers, including a report-only Content Security Policy, are set in `next.config.mjs`.

Rollback: Vercel instant rollback to the previous production deployment, or redeploy from the `pre-modernization` git tag.

## Modernization

Work in progress is tracked in `docs/modernization-audit/08-EXECUTION-CHECKLIST.md`, with judgment calls logged in `docs/modernization-audit/DECISIONS.md`.
