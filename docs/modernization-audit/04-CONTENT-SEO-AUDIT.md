# 04 — Content, Positioning, and SEO Audit

Inputs: all page copy in `src/lib/phase-one-pages.tsx` and `src/lib/site-content.ts`, 22 project entries in `src/content/projects.ts`, metadata routes, live `robots.txt`/`sitemap.xml`, and read-only Obsidian context (`About Paul.md`, `Projects Overview.md`, `Writing Style.md`).

**Ground rules applied:** nothing below invents achievements, metrics, titles, or dates. Where the site needs facts it does not have, the item is marked **NEEDS PAUL**.

---

## 1. Positioning: does the site say who, what, for whom, and why?

| Question | Current answer | Assessment |
|---|---|---|
| Who | "Paul Rodriguez" + tagline "AI Solutions Architect / Solutions Engineer / Workflow Automation" | Clear. Three-way slash title is a little hedged; fine for a multi-role search. |
| What I specialize in | Hero body: "turn complex business problems into AI-enabled workflows, enterprise software solutions, and clear technical execution plans." | Accurate but abstract. Every competitor says this. |
| Business problems solved | "What I Do" cards: discovery/architecture, AI workflow automation, customer-facing technical validation | Good framing. Card 3's title is jargon. |
| Technical expertise | Skills pills (About), tags on projects, Tools & Patterns paragraph (AI Workflows) | Present but list-like. No "how I think" content. |
| Architectural capability | American National case study; Larkin Hoffman re-architecture bullet; private-fund workflows bullet | Strong evidence exists but is buried on About and inside detail pages that `/projects` does not link to. |
| Accomplishments / impact | About experience bullets carry real numbers ($8M+, $16M+, 164%, 250%, 35%, 30%, 200%, 20%, 25%) | The numbers are the best content on the site and appear once, inside collapsed accordions. |
| Why contact me | CTA band + contact intro | Adequate. No differentiator stated. |

**Context from Obsidian (authoritative for intent):** audience is résumé-checkers (recruiters, hiring managers, senior buyers); target roles are Solutions Architect, Sales Engineer, Presales, DevRel, Field Engineer, Value Architect, Technical GTM; **do not put job-search signal on this public site**; prodriguez.dev is the companion to a future smartcodeshop.com studio site with a "clean division of labor." Implication: this site should read as a **professional identity and proof site**, not a freelance sales page and not an "open to work" page. The current copy mostly respects this; the contact subjects ("Solutions Architecture Engagement") lean slightly consulting-forward, which is acceptable.

### Recommendations (copy, no new facts)
1. **Hero:** keep name/tagline; replace the body with a two-sentence version that names a domain and a proof already on the site, e.g. "I design AI-enabled workflows and customer-facing systems for financial services, insurance, and service businesses. Recent work includes a digital annuity purchase flow tied to $8M+ in investments and a reusable kit for client-specific AI assistants." (Both facts are already published on About/projects. **Confirm wording with Paul.**)
2. **Stats band:** use facts already on the site: `$8M+ annuity purchases supported`, `24 investor-onboarding workflows`, `164% YoY sales lift (DISH)`, `10+ years`. Drop "AI / Workflow Automation."
3. **"What I Do" card 3:** retitle to "Technical Validation for Sales & Delivery" or "Demos, POCs, and Stakeholder Alignment" (**Paul's choice**).
4. **Add a short "How I work" section** (About or home) using the existing "listen, map the workflow, separate signal from noise, design, prototype, keep humans in control" paragraph as 5 steps. No new claims needed.
5. **Testimonials:** two quotes on home, five on About, from five people with role descriptions like "Product and technology leader." **NEEDS PAUL:** titles/companies and permission, or reduce to the strongest two with full attribution. Unattributed quotes read as placeholders to a hiring manager.
6. **Experience accordion:** open the first item by default (already does) and surface the top three numbers in a non-collapsed "Highlights" strip above it.
7. **Certifications** appear twice on About (bio sidebar and Education card). Keep one.
8. **Resume PDF:** last updated 2026-06-02 per git. **NEEDS PAUL:** confirm it is current; show "Updated June 2026" next to the download link.
9. **Writing style:** copy already follows Paul's rules (short paragraphs, no em dashes; note `phase-one-pages.tsx` uses `--` in two places where an em dash would have gone; fine). Maintain.

---

## 2. Project content inventory

| uid | Year | Client | Narrative slices | Images | Outcome stated | Grade |
|---|---|---|---|---|---|---|
| workflow-intelligence-kit | 2026 | Smart Code Shop | Overview / Supports / Why | 1 | qualitative | B+ (needs architecture detail; the Obsidian note calls the WIK architecture essay a launch blocker for the companion site — reuse it here when written) |
| american-national-annuity-application | 2026 | Auxo / American National | Overview / Owned / Why | 1 | $8.2M, up to $3M, 10-min funding | A- (best entry; add role title, team size, stack) |
| larkin-hoffman | 2024 | Great Jakes | 1 text slice | 1 | 35% scalability (on About only) | B |
| dish---branding-microsite | 2019 | DISH | 1 text slice | 0 | 164% (on About only) | B- (no image) |
| domo-visualizer | 2019 | DISH | none | 0 | none | C |
| dynamic-html5-banners | 2019 | DISH | none | 0 | 200% conversion (on About only) | C |
| sullivan-worcester, tarter-krinsky, moses-singer, polsinelli, ice-miller, wilson-elser, robinson-cole, ub-greensfelder, patterson-belknap | 2022–2024 | Great Jakes | none | 1 each | none | C+ (near-identical law-firm site blurbs) |
| ontech-smart-services | 2019 | DISH | none | 1 | 20% new-business (on About only) | B- |
| susan-bruce-travel, five-seasons-windows, windy-city-classics, happier-homes | 2022–2023 | small business | none | 1–3 | none | C |
| roofstops, rhyme-on-a-dime | 2017 | school projects | none | 0 | none | D (consider archiving or removing) |

**Recommendations**
- **Tier the archive.** Tier 1 (full case studies, linked from home): WIK, American National, Larkin Hoffman, DISH microsite. Tier 2 (card + short page): Sullivan & Worcester, Ice Miller, Moses & Singer, Polsinelli, OnTech, DCO banners, Domo. Tier 3 (archive list, no detail page, or removed): remaining law-firm sites, small-business sites, school projects. **NEEDS PAUL:** which Tier 3 items to keep.
- **Move numbers to where the work is.** Each Tier 1/2 page should restate the relevant metric already on About (they are the same engagements).
- **Consolidate the nine Great Jakes entries** into one "Law-firm platform modernization at Great Jakes" case study with a client logo/screenshot grid, plus Larkin Hoffman as the flagship. Nine near-duplicate pages dilute the archive and the sitemap.
- **Case-study template fields** to add to `ContentEntry` (optional, all nullable): `role`, `summary` (one sentence for cards and `metaDescription`), `outcome` (short callout), `stack: string[]`, `tier`. Populate from existing text; mark unknowns as **NEEDS PAUL**.
- **Images needed (NEEDS PAUL):** DISH microsite, Domo visualizer, DCO banners (screenshots or recordings), a sharper standing cutout for the hero, a real OG image.

---

## 3. Information that requires Paul's input before implementation

1. Testimonial attributions (names are shown; titles/companies/permission are not).
2. Which of the 8 orphaned and 2 school projects to keep, archive, or delete.
3. Approval of the hero body rewrite and stats selection (uses existing facts only).
4. Role title on the American National and WIK case studies ("Solutions Architect" per About; confirm).
5. Current resume PDF and its date.
6. Image assets listed above.
7. Vercel dashboard facts: Node version, env vars present (`RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM`), verified sending domain in Resend, Git integration/preview deploys enabled.
8. Whether `/silver-tech-help` should remain (it is a separate audience; keeping it unlisted is fine).
9. Whether to add privacy-friendly analytics (Vercel Analytics) — default recommendation: yes, it is free on Hobby and has no cookie banner implications.
10. Dark mode: out of scope unless Paul asks (adds token work and photo treatment).

---

## 4. SEO and discoverability

**Working today (verified):** canonical URLs, title template `%s | Paul Rodriguez`, descriptions on every page, OpenGraph + Twitter cards, `robots.txt`, `sitemap.xml` with all public URLs, `noindex` on the unlisted page, favicon set, apex→www redirect, HSTS, static HTML for every page (no JS required for content).

**Gaps and fixes**

| Item | Finding | Fix | Priority |
|---|---|---|---|
| Structured data | None | JSON-LD `Person` (+`sameAs`) and `WebSite` on `/`; `Person` on `/about`; `CreativeWork` on project pages | P1 |
| OG image | Hero photo reused; no name/title text | Design one 1200×630 image, or generate with `next/og` per page (name, role, project title) | P1 (static) / P3 (generated) |
| Site URL | Defined three times | One `SITE_URL` in `src/lib/site.ts` | P2 |
| Sitemap `lastmod` | Build time for all URLs | Use project `date`; use a `updated` field for pages | P2 |
| Project `metaDescription` | None of 22 | Author `summary` for Tier 1/2; fallback remains | P1 (content) |
| Orphan pages | 8 projects in sitemap without inbound links | Link from `/projects` or remove from build + sitemap | P1 |
| `h1` | Missing on `/projects`, `/ai-workflows` | Fix with `DisplayHeading as="h1"` | P1 |
| Twitter | No `creator`/`site` handle | **NEEDS PAUL** (optional) | P3 |
| Web manifest / theme-color | None | Add `manifest.ts` + `themeColor` in metadata | P2 |
| Internal linking | AI Workflows page links nowhere | Link to WIK case study, GitHub repo, contact | P1 |
| Alt text | Present everywhere | Set `alt=""` on the hero background photo | P2 |
| Keyword alignment | Titles target "AI Solutions Architect", "Solutions Engineer", "AI Workflow Automation" | Matches Paul's target roles; keep. Add "Sales Engineer"/"Presales" to the About description if Paul wants those searches | P2 (**Paul**) |
| Analytics / Search Console | None in repo | Add Vercel Analytics; **Paul** verifies the domain in Google Search Console and submits the sitemap | P2 |

**Core Web Vitals (hypothesis, no Lighthouse run):** static HTML, self-hosted fonts, `priority` on hero images, and ~129 kB first-load JS suggest good LCP/INP. Risks: hero background `fill` image without `sizes`, 54 font-face declarations, GSAP in the shared chunk. Run Lighthouse on the preview deployment as part of P1-06 and record scores in the checklist.
