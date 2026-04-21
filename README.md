# prodriguez-portfolio-2024

Personal portfolio site built with Next.js, TypeScript, Prismic, Tailwind, Sass, and GSAP.

## Stack

- Next.js 14
- React 18
- TypeScript
- Prismic CMS
- Tailwind CSS
- Sass
- GSAP

## Requirements

- Node.js 18.17+ recommended
- npm
- access to the connected Prismic repository

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
- `npm run slicemachine` - launch Slice Machine for Prismic slices

## Prismic setup

This project pulls site content and metadata from Prismic.

Important files:

- `src/prismicio.ts` - Prismic client setup and route resolvers
- `slicemachine.config.json` - repository configuration
- `customtypes/` - custom type schemas
- `src/slices/` - slice components

If you point this repo at a different Prismic environment, check:

- `NEXT_PUBLIC_PRISMIC_ENVIRONMENT`

If that variable is not set, the app falls back to the repository name from `slicemachine.config.json`.

## Project structure

```text
src/
  app/           App Router routes
  components/    shared UI components
  slices/        Prismic slice components
  scss/          global Sass utilities and styles
  utils/         helper functions
```

## Notes

- The site now uses the public `gsap` package. No private GSAP registry or auth token is required.
- Global site metadata is generated from the Prismic `settings` document in `src/app/layout.tsx`.
- Header and footer both consume the shared `settings` payload passed from the root layout.

## Recommended next cleanup

- upgrade Next.js to a patched release
- reduce remaining lint/type debt in shared components
- improve contact form embedding so it is not hardcoded to one JotForm script
- document deployment workflow if this repo is used as a portfolio sample for clients or hiring
