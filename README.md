# prodriguez-portfolio-2024

Personal portfolio site built with Next.js, TypeScript, local content modules, Tailwind, Sass, and GSAP.

## Stack

- Next.js 14
- React 18
- TypeScript
- Local TypeScript content files
- Tailwind CSS
- Sass
- GSAP

## Requirements

- Node.js 18.17+ recommended
- npm

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

## Recommended next cleanup

- upgrade Next.js to a patched release
- reduce remaining lint/type debt in shared components
- improve contact form embedding so it is not hardcoded to one JotForm script
- document deployment workflow if this repo is used as a portfolio sample for clients or hiring
