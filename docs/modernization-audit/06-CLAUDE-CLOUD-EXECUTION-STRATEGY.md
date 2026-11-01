# 06 — Claude Cloud Execution Strategy

**Constraint that dominates everything: the ~$200 in credits expires 2026-11-04. Today is 2026-11-01. There are roughly 72 hours.** The strategy below is built for that window: front-load the highest-value batches, run independent batches in parallel sessions on separate branches, and treat a merged, deployed, polished site as the finish line rather than roadmap completeness.

---

## 1. Pricing basis (relative, with the one verified table)

Published first-party API rates (cached in the Claude API reference used for this audit, dated 2026-10-06; per million tokens, input / output):

| Model | Input | Output | Role in this plan |
|---|---|---|---|
| Claude Opus 5.5 (`claude-opus-5-5`) | $4 | $20 | Architectural batches (Next 16 upgrade, tokens + module split, detail-page rebuild) |
| Claude Sonnet 5.5 (`claude-sonnet-5-5`) | $2 | $10 | Most implementation batches (P0 patch set, a11y, images, SEO, CI, tests) |
| Claude Haiku 5.5 (`claude-haiku-5-5`) | $0.10 | $0.50 | Mechanical sweeps (dead-code deletion, Prettier, README edits, checklist updates) |
| Claude Fable 5.1 (`claude-fable-5-1`) | $10 | $50 | Not needed; no task here requires it |

Cache reads are a fraction of input price, so a session that keeps a stable prefix (the master prompt + audit docs) and avoids re-reading the repo is far cheaper than its raw token count suggests.

**How Claude Cloud credits map to these rates is not documented in the sources checked. Treat the dollar figures below as order-of-magnitude estimates, not quotes.** Check the usage page after Batch 1 and recalibrate.

Rough session shapes on this repo (≈3,700 lines of app code + 1,400 lines of content; a full read is ~60–80K tokens):

| Session type | Typical shape | Estimate if billed at API rates |
|---|---|---|
| Sonnet 5.5, focused batch (10–20 files, 2–4 build loops) | 0.5–1.5M input (mostly cached), 40–80K output | $2–8 |
| Opus 5.5, architectural batch (refactor across 30+ files, repeated builds, screenshots) | 1.5–4M input (mostly cached), 100–200K output | $10–30 |
| Haiku 5.5, cleanup sweep | 0.3–0.8M input, 20K output | < $1 |

Budget plan: Batches 1–4 ≈ $60–110 at these rates, leaving headroom for reruns, a content batch once Paul answers the open questions, and a final verification pass. Do not plan to spend the last ~$30 until the final verification is green.

---

## 2. Batches, models, and parallelism

| Batch | Scope (roadmap IDs) | Model / effort | Branch | Can run in parallel with |
|---|---|---|---|---|
| **1 · P0 ship** | P0-01…P0-06 | Sonnet 5.5, medium | `modernize/p0` | — (do first; everything branches from it) |
| **2a · Next 16** | P1-01 | Opus 5.5, high | `modernize/next16` | 3-tests |
| **2b · Tokens + split + type tune** | P1-02, P1-07, P1-11 | Opus 5.5, high | `modernize/tokens` (branched from 2a once merged) | 3-tests |
| **3-tests · CI + tests** | P1-09, P1-10 | Sonnet 5.5, medium | `modernize/ci` (from Batch 1) | 2a, 2b |
| **3-ui · Detail pages, index, a11y, images, SEO** | P1-03, P1-04, P1-05, P1-06, P1-08 | Sonnet 5.5, high (Opus for P1-03 if the template needs design judgment) | `modernize/ui` (from 2b) | 4 |
| **4 · Cleanup + docs** | P2-01, P2-02, P2-03, P2-06, P2-07 | Haiku 5.5 for deletion/format; Sonnet 5.5 for Sass retirement | `modernize/cleanup` (from 3-ui) | 3-ui tail |
| **5 · Content + polish** | P2-04, P2-05 | Sonnet 5.5, medium | `modernize/content` | needs Paul's answers |
| **6 · Final verification** | all acceptance criteria, Lighthouse, deploy readiness | Opus 5.5, medium | on `master` candidate | — |

Parallel sessions must not touch the same files. The matrix above is designed so that 2a/2b (framework + tokens) and 3-tests (CI/tests) are file-disjoint. Batch 3-ui must wait for 2b because it consumes the tokens and the split module layout.

### Suggested 72-hour timeline

| Window | Run | Paul's actions |
|---|---|---|
| Nov 1 evening | Batch 1 (≈1–2 h) → merge → deploy → check live headers and typography | Answer the 10 questions in 04 §3; verify Vercel Node + env vars |
| Nov 2 morning | Batch 2a and Batch 3-tests in parallel | Review 2a PR (screenshots), merge |
| Nov 2 afternoon | Batch 2b | Review tokens PR, merge |
| Nov 2 evening / Nov 3 morning | Batch 3-ui | Review, merge; supply image assets if available |
| Nov 3 afternoon | Batch 4 and Batch 5 (content needs answers) | Sign off on copy diffs |
| Nov 3 evening | Batch 6 final verification → merge → production deploy | Smoke the live site |
| Nov 4 | Buffer for fixes; do not start new scope | |

---

## 3. Which tasks need deep reasoning vs. fast models

**Deeper reasoning (Opus 5.5, high effort):**
- P1-01 Next 16 upgrade: codemod output review, async `params`, ESLint 9 migration, Turbopack + Sass interplay.
- P1-02 token system design and the pure-move split of a 1,282-line module without changing output.
- P1-03 case-study template (design judgment, data-shape changes).
- Batch 6 final verification (holistic judgment across acceptance criteria).

**Fast/cheaper models (Sonnet 5.5 default, Haiku 5.5 for mechanical work):**
- P0 patch set (precise, scripted), security headers, contact hardening, `sizes` attributes, JSON-LD, CI YAML, test scaffolds, dead-code deletion, Prettier alignment, README, checklist updates.

Rule of thumb: if the task is "apply a known change to a known list of files," use Sonnet or Haiku. If the task is "decide the shape of something many files will depend on," use Opus.

---

## 4. Minimizing repository re-reading

1. **The master prompt (07) carries the architecture summary.** The execution agent should read `docs/modernization-audit/01` and `08` first, then only the files its batch names. It should not re-run discovery.
2. **Per-batch file lists** are in the roadmap and the checklist. Agents should open those files, not `src/**`.
3. **Stable prefix for caching:** start every session with the same two things in the same order: the master prompt, then the checklist. Put volatile status at the end of the message, not the beginning.
4. **Avoid dumping large files into context:** `src/content/projects.ts` (1,419 lines) should be read with targeted `sed -n`/`grep` ranges, never whole, unless the batch edits it.
5. **Build output is the ground truth:** paste only the route table and errors, not the full log.

---

## 5. Maintaining context between sessions

- `docs/modernization-audit/08-EXECUTION-CHECKLIST.md` is the single progress tracker. Every session updates task status, adds the verification evidence (command + result, one line each), and records decisions under "Decision log."
- Each batch is one PR with a descriptive title (`modernize: P0 security and font fix`), a body listing the task IDs, acceptance evidence, and any deferred items. Commits end with the attribution line from the session system reminder.
- `docs/modernization-audit/DECISIONS.md` (created by the first execution session) records any judgment call the agent made without Paul (e.g. which Tier 3 projects were kept) so later sessions and Paul can reverse it.
- Nothing is tracked in chat. If a session dies, the next one resumes from the checklist and the branch.

---

## 6. Checkpoints and tests

| Checkpoint | Gate |
|---|---|
| After every task | `npm run typecheck && npm run lint && npm run build` |
| After Batch 1 | `npm audit --omit=dev` clean of next/swiper; live headers verified; compiled CSS font check |
| After Batch 2a | Route table identical; screenshot diff of five pages; Playwright smoke green |
| After Batch 2b | Contrast script green; HTML text diff empty; screenshots at four widths |
| After Batch 3-ui | axe = 0 serious/critical on five pages; every project page has an inbound link; Lighthouse mobile ≥ 90 performance / 100 accessibility on preview |
| After Batch 4 | No `.scss`; Prettier check green; README accurate |
| Batch 6 | Full checklist walk; production deploy; live smoke of all sitemap URLs (200) |

Vercel preview deployments (assumed via Git integration) are the visual review surface. If previews are not enabled, the agent should run `next build && next start` and capture Playwright screenshots into `docs/modernization-audit/screenshots/` (gitignored unless Paul wants them).

---

## 7. Preventing scope creep

- The checklist is the scope. Anything not on it goes into "Proposed follow-ups" at the bottom of the checklist, not into code.
- No new dependencies beyond those named in the roadmap (`vitest`, `@playwright/test`, `@axe-core/playwright`, `@vercel/analytics`, `@vercel/speed-insights`, `eslint@9` + `eslint-config-next`, `@next/mdx` only if P3-02 is approved).
- No dark mode, no CMS, no new animation library, no redesign of the hero concept, no copy that introduces facts not already on the site or supplied by Paul.
- A batch that discovers a problem outside its scope logs it and continues.

---

## 8. Preserving working functionality

- Branch per batch; never commit directly to `master`.
- Before touching a page, capture its rendered HTML (`curl localhost:3000/<path> > /tmp/before.html`) and after the change compare visible text (`html-to-text` or a Playwright `innerText` dump). Refactors must produce zero text diffs.
- The contact route must keep its contract: same request body, same status codes for validation errors.
- The URL set must not change without a decision: `generateStaticParams`, sitemap, and any removed Tier 3 pages must be handled together, and removed URLs get `redirects()` entries to `/projects`.
- Tag the pre-modernization commit (`git tag pre-modernization c6bec99`) so rollback is one command. Vercel keeps the previous deployment for instant rollback as well.

---

## 9. Context and cost hygiene inside a session

- Read with ranges; edit with precise replacements; build once per logical change, not per file.
- Prefer `grep -rn` to find usages over opening files.
- Keep screenshots to the four widths × five pages; do not screenshot every component.
- Stop a session at a natural checkpoint (green build + updated checklist + PR opened) rather than at a token limit.
- If a session exceeds its estimate by 2×, stop, commit WIP to the branch, update the checklist, and start a fresh session with a narrower prompt.

---

## 10. What is realistically achievable before Nov 4

**Confident (Batches 1–3-ui, 3-tests):** patched and upgraded framework, correct typography, tokens with passing contrast, light-themed case-study pages linked from a real projects grid, accessibility fixes, image sizing, structured data, CI with a small test suite. This is the "polished, deployable portfolio" goal.

**Likely (Batch 4):** Sass retired, dead code gone, tooling aligned, README/DESIGN docs.

**Conditional on Paul's answers (Batch 5):** copy improvements, testimonial attributions, AI Workflows page rebuild, Great Jakes consolidation.

**Out (P3):** generated OG images, blog, dark mode, Tailwind 4, view transitions. Keep them in the checklist as follow-ups for a later budget.
