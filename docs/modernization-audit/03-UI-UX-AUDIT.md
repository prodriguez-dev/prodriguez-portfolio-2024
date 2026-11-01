# 03 — UI/UX, Visual Design, and Accessibility Audit

Method: source-level review of every page and component, computed WCAG contrast ratios for every color pair in use, compiled-CSS inspection, and HTTP probes. **No browser rendering was performed.** Findings are labeled **Source-verified** (certain from code/CSS) or **Visual hypothesis** (needs a browser screenshot to confirm). The execution agent should take screenshots of every page at 390 px, 768 px, 1280 px, and 1920 px widths before and after changes.

---

## 1. First impression and visual hierarchy

**What the design intends (handoff redesign, mid-2026):** warm off-white canvas (`#f4f1eb`) with a darker band (`#ede9e1`), white cards with hairline borders and soft shadows, a burnt-orange accent (`#c4621a`), tiny uppercase tracked eyebrows, and very large black-italic *condensed* display type. Dark photographic hero. This is a coherent, premium, editorial direction and should be **retained**.

**What actually ships (Source-verified, see 02 §F-06):** the condensed display faces are not applied anywhere. Every display element renders in regular-width Sofia Sans at weight 900 italic. Consequences, as hypotheses pending screenshots:
- Hero name at `clamp(3.9rem, 12vw, 10rem)` with `whitespace-nowrap` is ~25–30% wider than designed; likely tight or clipped at 390 px and competing with the standing-photo column at ≥1280 px.
- Section headings at up to 7rem feel heavy rather than tall and elegant.
- Eyebrows (`tracking-[0.2em]`) and the nav logo are wider than their layout slots assume.

**Action:** fix F-06 first, then re-tune `clamp()` ranges and max-widths with screenshots. Do not redesign the hero until it is seen in the intended font.

**Retain:** palette, card system, eyebrow/heading/body rhythm, dark hero with photo, sticky floating nav.
**Improve:** typography (above), hierarchy of the stats band, project cards.
**Redesign:** project detail pages (currently the old dark theme, 02 §F-07).
**Remove:** hidden skills marquee, decorative Unicode glyphs used as icons, "AI" stat.

---

## 2. Typography and spacing

- **Font system (Source-verified):** three families, 54 face declarations (02 §F-20). After F-06, define three semantic roles and stop choosing per element: `display` (Extra Condensed 900 italic uppercase), `label` (Condensed 800 italic uppercase, tracked), `body` (Sofia Sans 400/500/700). Expose as Tailwind `font-display`, `font-label`, `font-sans`.
- **Scale (Source-verified):** sizes are ad hoc: `text-[14px]`, `text-[14.5px]`, `text-[15px]`, `text-[16px]`, `text-[17px]`, `text-[18px]`, `text-[19px]`, `text-[20px]`, and six different `clamp()` expressions for headings. Replace with a 6-step type scale (`text-xs … text-2xl` remapped) plus three display steps (`display-sm/md/lg` as `clamp()` tokens). Keep body at 17–18 px desktop / 16–17 px mobile.
- **Line length:** body paragraphs are capped at `max-w-[72ch]` / `68ch` on About; home card bodies at 15 px/`leading-7` are a touch small. Raise card body to 16 px.
- **Spacing:** sections are uniformly `py-24` (96 px) which reads monotonous; the stats band is `py-0` jammed under the hero; the contact-CTA card inside a `py-24` band is fine. Introduce `section-sm/md/lg` spacing tokens (64/96/128) and vary rhythm: hero → stats (flush) → services (96) → projects (128) → testimonials (96) → CTA (96).
- **Legacy Sass scaling (`sP()`, `global-text-*`):** only used on project detail pages. Retire with the detail-page rebuild.

---

## 3. Color and contrast (Source-verified, computed)

| Pair | Ratio | WCAG AA (text) | Where |
|---|---|---|---|
| `#111111` on `#f4f1eb` | 16.75 | Pass | Primary text |
| `#4d4a45` on `#ffffff` | 8.82 | Pass | Card body |
| `#67625c` on `#ffffff` | 6.04 | Pass | Stat labels |
| `#5f5a54` on `#ede9e1` | 5.64 | Pass | Footer links |
| `#666666` on `#ece8df` | 4.70 | Pass | Tag pills |
| `#7a7570` on `#ffffff` | 4.56 | Pass | Muted text on cards |
| **`#7a7570` on `#f4f1eb`** | **4.04** | **Fail** (needs 4.5) | Inactive nav links (14 px bold), featured-projects intro, testimonial roles |
| **`#7a7570` on `#ede9e1`** | **3.77** | **Fail** | Same text on the darker band |
| **`#c4621a` on `#ffffff`** | **4.11** | **Fail** for text < 18.66 px bold | "View all projects", eyebrows, institution names on cards, "Visit Site" |
| **`#ffffff` on `#c4621a`** | **4.11** | **Fail** | Every primary button label (13 px bold) |
| **`#c4621a` on `#f4f1eb`** | **3.65** | **Fail** | Eyebrows on page background |
| **`#c4621a` on `#ede9e1`** | **3.39** | **Fail** | "Selected Work" eyebrow, "Skills", "Education" eyebrows |
| `#b85b17` on `#ffffff` | 4.62 | Pass | Darker accent variant |
| **`#b85b17` on `#f4f1eb`** | **4.10** | **Fail** | Eyebrows using the darker variant |
| **`#d55c45` on `#ffffff`** | **3.86** | **Fail** | Form validation error text |
| `#f3ab68` on `#1a1610` | 9.29 | Pass (photo overlay not modeled) | Hero tagline |
| `#e0dbd0` on `#fcfbf8` | 1.33 | Fail non-text (needs 3:1) | Input borders at rest |
| `#c4621a` on `#fcfbf8` | 3.97 | Pass non-text | Focused input border |
| `#bdb8ae` on `#ffffff` | 1.98 | Fail non-text | Card hover borders (decorative, acceptable) |

**Recommendation.** Keep `#c4621a` as the *brand* accent for large display numbers, buttons' backgrounds with **dark** text, borders, and decorative marks. Introduce `accent-text` ≈ `#9c470d` (≈5.0:1 on `#ede9e1`, ≈5.5:1 on `#f4f1eb`, ≈6.3:1 on white; verify with the token script in P1-02) for eyebrows, links, and any accent text under 18.66 px bold. Replace `#7a7570` with `#67625c` wherever it sits on `#f4f1eb`/`#ede9e1`. Replace error red with `#b23a26` (verify ≥4.5:1 on white). Give inputs a dedicated `line-input` border token `#8f887c` (≈3.2:1 on `#fcfbf8`, the non-text minimum); keep `#cfc8ba` as the hover/strong card border, which is decorative. Primary buttons: either darken the fill to `#9c470d` with white text, or keep `#c4621a` with `#111111` text; pick one and apply site-wide.

---

## 4. Navigation and information architecture

- **Nav (Source-verified):** About / Projects / AI Workflows / Contact. Clear. The `aria-current` handling and mobile disclosure are correct. Missing: skip link, `Escape` to close the mobile panel, and the panel is not a focus trap (acceptable for a disclosure, but add Escape).
- **Home → detail path:** only four featured cards lead to case studies. `/projects` is a dead end for detail content (02 §F-08). This is the biggest IA defect: the strongest evidence of capability is unreachable.
- **`/ai-workflows`:** two text sections, no heading hierarchy (`h2` only), no imagery, no links to the Workflow Intelligence Kit case study or GitHub repo, no CTA. It is the page the hero's secondary CTA points to, so it is a high-traffic dead end. Add: h1, a short "what I build" grid, links to the WIK case study and repo, and a contact CTA.
- **`/silver-tech-help`:** intentionally unlisted and `noindex`. Fine. Keep out of nav and sitemap.
- **Footer:** complete (nav, socials, copyright, "built with" line). Keep.
- **Blog:** route exists, no content, no nav entry. Leave dormant or remove.

---

## 5. Homepage storytelling

Current order: Hero → Stats → What I Do → Featured Projects → Testimonials → CTA. The order is right. Content-level notes:
- **Hero body** is a single generic sentence. Add one concrete proof line under it (e.g. the American National or private-fund numbers already on the About page) so the hero states who/what/proof in three lines.
- **Stats band:** "10+ Years Experience" (fine), "24 Private Fund Workflows" (needs context; "24 investor-onboarding workflows, $16M+"), "164% Sales Lift (DISH)" (good, cite year), **"AI / Workflow Automation" is a label, not a metric** and weakens the row. Replace with a real number or drop to three stats.
- **What I Do:** three cards, numbered eyebrows. Good. Card titles are long (`Customer-Facing Technical Validation`); shorten and let the body carry nuance.
- **Featured Projects:** four cards with a 160 px image strip. The card title at `clamp(2.2rem,5vw,3.6rem)` dominates; client/year line above it is good. After F-06 the titles will fit better. Add a one-line outcome under each title.
- **Testimonials:** two quotes with vague roles ("Product and technology leader"). Without a title and company they read as filler. **Needs Paul:** permission to show full attribution, or cut to one strong quote.
- **CTA card:** fine.

---

## 6. Project and case-study presentation

- **Index (`/projects`):** category filter pills + accordion rows with a 56 px thumbnail, tag pills, year, and an expanded panel containing bullets, "Visit Site", and a large image. The accordion hides content and gives no path to the full case study. Replace with a filterable card grid (image, client, title, one-line outcome, tags, "Read case study"). Keep the category pills (they are a good scanning aid) but derive categories from data rather than the hardcoded list.
- **Detail pages:** legacy dark theme (02 §F-07). Content shape per entry is strong for the two 2026 case studies (Overview / What I owned / Why it matters), thin for the 2022–2024 law-firm sites (one bullet list, one screenshot), and image-less for five older entries. Proposed template: hero strip (client · year · role · category), summary bullets, outcome callout (numbers if available), narrative sections rendered from slices, image gallery, stack tags, prev/next, "Discuss a similar project" CTA.
- **Prev/next:** stored as navigation slices in content; some entries have none. Compute from `projectListOrder` instead.

---

## 7. Mobile experience (Source-verified + hypotheses)

- Breakpoints: Tailwind `md` (768) and `lg`/`xl`/`2xl`; the Sass `mobile` mixin cuts at 767. Consistent enough.
- Hero: `min-h-[100svh]` with `pt-20` and `items-start` on mobile; name uses `whitespace-nowrap` at `12vw` → **hypothesis:** "RODRIGUEZ" (9 chars) at 12vw ≈ 47 px/char in the wrong font will overflow at 390 px. Re-check after F-06; allow wrapping or reduce `vw`.
- Stats: single column with dividers. Good.
- `/projects` accordion header grid `md:grid-cols-[88px,1fr,120px]`; on mobile the thumbnail becomes a full-width 56 px strip, which looks odd. Hypothesis; the card grid replaces it anyway.
- Nav mobile panel: good. Tap targets ≥ 40 px.
- `SkillsSectionBlock` shows pill rows only on mobile (`md:hidden`) and the marquee block is `hidden` everywhere, so **desktop shows only the second pill list**; the first two rows never appear on desktop. Remove the marquee and the mobile-only rows; show one pill set.

---

## 8. Microinteractions and animation

- Hero: GSAP entrance (name slide/rotate, body/CTA fade) + typed tagline with blinking cursor. Tasteful; keep. **Missing:** `prefers-reduced-motion` handling (the hook exists but `HeroMotion` ignores it). With reduced motion, render the final state immediately.
- `NameLogo` hover scramble via `SplitText`: cute, non-essential, costs GSAP in every page bundle. Keep or move to CSS; low priority.
- Card hover lift (`hover:-translate-y-1` + shadow) and button lift: consistent, keep.
- Accordions: `grid-rows-[0fr→1fr]` transition. Good pattern.
- Add `motion-safe:` / `motion-reduce:` variants to all transforms.

---

## 9. Accessibility (WCAG 2.2 AA readiness)

Source-verified gaps, in priority order:

1. **Contrast** failures listed in §3 (1.4.3). Highest volume issue.
2. **No skip link**; `<main>` has no `id` (2.4.1).
3. **Form (`ContactForm.tsx`)**: inputs have no `id`/`name`/`autocomplete`; errors are not associated (`aria-describedby`), no `aria-invalid`, no `role="alert"`/live region for submit errors or success; placeholder used as hint only (fine) (1.3.1, 3.3.1, 3.3.2, 4.1.3).
4. **Focus visibility**: `reset.scss` sets `input { outline: none } input:focus { outline: none }` which outranks the global `:focus-visible` rule for inputs; the only focus cue is the border color change (3.97:1, passes 3:1 but weak). Add an explicit `focus-visible:ring-2` on inputs, selects, textareas (2.4.7, 2.4.11).
5. **Disclosure semantics**: `ExperienceAccordion` and `ProjectsExplorer` toggle buttons lack `aria-expanded` and `aria-controls`; category filters lack `aria-pressed` (4.1.2).
6. **Decorative glyphs in text**: `˅`, `●`, `→`, `↗`, `◆`, `✉` are read aloud by screen readers where not `aria-hidden` (the accordion chevron is hidden; bullets, arrows, and the CTA envelope are not). Replace with SVG icons marked `aria-hidden` or CSS pseudo-elements.
7. **Typed tagline**: text content mutates ~60 times on load; wrap in `aria-live="off"` and provide the full string to assistive tech from the start (e.g. visually-hidden full text + `aria-hidden` animated span).
8. **Heading structure**: `/projects` and `/ai-workflows` lack `h1` (02 §F-09); the About page has `h1` "Paul Rodriguez" then `h3` card titles with no `h2` for Experience (`DisplayHeading` is `h2`, fine) — verify order with a headings outline.
9. **Images**: `alt` is present on all content images; several use the project title as alt for decorative thumbnails (acceptable). The hero background photo has alt "Paul Rodriguez on stage" behind a dark overlay; set `alt=""` since the standing image conveys the same.
10. **Mobile menu**: add `Escape` to close and return focus to the toggle (2.1.2).
11. **Target size**: nav links are text at 14 px with `px-2 py-1` in the footer (≈ 28 px tall). 2.5.8 (AA, 24×24 minimum) passes; could be more generous.
12. **Language/landmarks**: `lang="en"`, `header`/`nav`/`main`/`footer` present. Good.

Validation method: `@axe-core/playwright` on five representative pages (no serious/critical), plus manual keyboard pass on nav, accordions, filters, and the form.

---

## 10. Calls to action and contact experience

- Primary CTA ("Contact") appears in nav, hero, CTA band, and footer. Consistent.
- Contact page: heading, intro, three link cards, form with subject select. Good structure. Success state replaces the form with a card; add focus management (move focus to the success heading).
- The hero's secondary CTA goes to `/ai-workflows`, the weakest page (§4). Either strengthen that page or point the secondary CTA at `/projects`.
- About page CTAs: "Download Resume" (opens PDF in new tab; add `download` attribute and file size) and "Get in Touch". Fine.

---

## 11. Overall polish and differentiation — recommended visual direction

Keep the current direction and execute it properly. Specifically:
1. **Make the condensed display type real** (F-06), then tune scale.
2. **Tokenize** colors/radii/shadows and fix contrast with an `accent-text` token.
3. **One card system**: `card` (white, hairline, soft shadow, 16–20 px radius) used identically on home, about, projects, detail, contact.
4. **Project detail template** in the light system with an outcome callout.
5. **Replace Unicode glyph "icons"** with a small SVG icon set (react-icons is already present).
6. **Restraint on motion**: keep the hero entrance and typed tagline, respect reduced motion, drop the marquee.
7. **Imagery**: a sharper standing cutout and properly sized photos; a real OG image with name and title.

This yields a site that looks deliberate and expensive without adding a single new animation pattern or trend.
