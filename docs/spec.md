# Phase 1 — Reference Analysis & Build Spec

**Reference:** [Folder Tab Designer Portfolio Template](https://21st.dev/@kedhareswer/templates/folder-tab-designer-portfolio-template)
by Kedhareswer Naidu. Live preview rendered from
`21stdev-my-components-one.vercel.app/#folder-tab-portfolio-template`.

**What we take:** layout structure, section rhythm, motion system.
**What we do not take:** colours, type, copy, imagery, logos, illustrations.

Captured at 1440 / 768 / 390 into `refs/` (gitignored — the reference's own
pixels must not enter this repo).

---

## 0. Brief reconciliation

Three things in the brief did not match the repo. Resolved as follows, flagged
for your correction:

| Brief says | Reality | Resolution |
| --- | --- | --- |
| Watch `/refs/motion.mp4` | No such file, and I cannot decode video | Motion spec derived from the **live DOM** — computed `transition`/`animation` values and `@keyframes` read directly off the page. More exact than reading a recording. |
| Content in `/content` (projects.json, bio.md, /images) | Content lives in `src/data/projects.ts`, `src/data/site.ts`, `public/shots/` | Mapped from the real locations. No migration needed. |
| BRAND fields blank | Already established and deployed | Name: Nishant Shekhar · Role: AI Systems Engineer · Colours: `#08090a` ground, `#4ade80` signal · Fonts: Inter + JetBrains Mono · Tone: technical-minimal |

---

## 1. Reference structure

Page height **6388px** at 1440, **10507px** at 390. Seven content sections, each
a rounded "folder" card floating on a pale ground, each introduced by a giant
outline display heading that draws itself on scroll.

| # | Section id | H (1440) | Padding | Pattern |
| --- | --- | --- | --- | --- |
| 01 | `r0-cover` | 703 | 22 / 0 | Folder-tab cover, huge display word, stacked colour folders with numbers |
| 02 | `r0-contents` | 915 | 22 / 48 | Chapter catalog, numbered rows, first row expanded |
| 03 | `r0-about` | 752 | 22 / 48 | Tilting portrait card + bio + credential chips + 3-point timeline |
| 04 | `r0-work` | 1305 | 22 / 48 | Filter pills + card cabinet grid; `r0-wf-panel` (923) is the details sheet |
| 05 | `r0-process` | 813 | 22 / 48 | Step tabs 01–04, giant numeral, `r0-ps-panel` (523) body |
| 06 | `r0-words` | 548 | 22 / 48 | Three gradient testimonial cards |
| 07 | `r0-contact` | 847 | 22 / 48 | Big CTA panel + email bar + social row |

**Repeating spine.** Every section carries a 10.5px uppercase meta strip
(`2025–2026 · VISUAL DESIGN · DETAILS PAGE · POSTERS · … · 02/07`) and a
paired display heading: Latin outline on the left, CJK solid on the right.
That left-outline / right-solid pairing is the template's strongest rhythmic
device and the thing worth stealing.

---

## 2. Extracted tokens

Measured from the live page, not guessed.

### Spacing & layout
- Section padding: `22px` top / `48px` bottom — uniform across all seven.
- Card inset from viewport edge: ~`16px` (1440), full-bleed minus gutter at 390.
- Grid: 4 columns at 1440, 2 at 768, 1 at 390.
- Rhythm increments observed: 4 / 8 / 12 / 22 / 44 / 48.

### Radii
| Value | Count | Role |
| --- | --- | --- |
| `99px` | 36 | Pills, filter chips, buttons |
| `12px 12px 0 0` | 29 | **Folder tabs** — the signature shape |
| `18px` | 26 | Section cards |
| `11–12px` | 37 | Inner cards, thumbnails |
| `26px` | 7 | Large panels |

### Type scale
| Size | Weight | Line-height | Tracking | Role |
| --- | --- | --- | --- | --- |
| 58px | 800 | 58px (1.0) | +1.16px | Display headings (outline) |
| 20px | 400 | 30px (1.5) | +1.2px | Section lead-in |
| 16px | 400 | 24px (1.5) | normal | Body |
| 15px | 700 | 19.5px | normal | Card titles |
| 12.5px | 400 | 21.875px (1.75) | normal | Card body |
| 12px | 600 | 18px | +0.96px | Tabs, buttons |
| **10.5px** | **600** | 15.75px | **+1.26px** | **Meta strip** — uppercase |
| 9.5px | 600 | 14.25px | +0.38px | Micro badges |

Reference uses system-ui throughout. We substitute Inter (display/body) and
JetBrains Mono (meta strip, numerals) — mono for the meta strip is a stronger
fit for an engineering portfolio than letter-spaced sans, and keeps the
`number-tabular` rule for stat columns.

### Breakpoints
`390` / `768` / `1440`. Single column below 768; grid 2-up at 768; 4-up at 1440.

---

## 3. Motion spec

Read from computed styles and `@keyframes`. **This is the part worth copying.**

### Keyframes

| Name | From → To | Use |
| --- | --- | --- |
| `ftp-draw` | `stroke-dashoffset: len → 0` | **Signature.** Outline headings draw on |
| `ftp-up` | `opacity 0, translateY(40px)` → `1, 0` | Section entrance |
| `ftp-in` | `opacity 0, translateY(16px)` → `1, 0` | Item entrance |
| `ftp-fade` | `opacity 0 → 1` | Plain reveal |
| `ftp-toast` | `opacity 0, translate(-50%,14px) scale(.96)` → `1, 0` | Copy-email toast |
| `ftp-wave` | `translateY(0 → -12px → 0)` | Decorative loop |
| `ftp-sway` | `rotate(-2deg → 3deg)` | Decorative loop |
| `ftp-twinkle` | `opacity .95 → .25 → .95` | Decorative loop |
| `ftp-shimmer` | `translateX(-10px → 10px)` | Decorative loop |

### Motion table

| Element | Trigger | Property | Duration | Easing | Delay / stagger |
| --- | --- | --- | --- | --- | --- |
| Outline display heading | scroll enter | `stroke-dashoffset` | 1.25s | `cubic-bezier(.65,0,.25,1)` | **0.07s per letter**, observed 0 → 0.56 |
| Section container | scroll enter | `opacity`, `transform` | 0.8s / 0.9s | `ease` / `cubic-bezier(.2,.8,.2,1)` | — |
| Card grid item | scroll enter | `opacity`, `translateY(40→0)` | 0.6s | `cubic-bezier(.2,.8,.2,1)` | 0.05–0.07s per item |
| Folder tab | hover | `transform` | 0.3s | `cubic-bezier(.3,1.5,.5,1)` ↩ overshoot | — |
| Work card | hover | `transform`, `box-shadow` | 0.5s | `cubic-bezier(.3,1.3,.4,1)` | — |
| Filter pill | click | `transform`, `background-color`, `color` | 0.35s | `cubic-bezier(.3,1.4,.5,1)` / `ease` | — |
| Catalog row | expand | `grid-template-rows` | 0.55s | `cubic-bezier(.2,.8,.2,1)` | — |
| Nav indicator | route/scroll | `width`, `opacity` | 0.4s | `ease` | — |
| Large panel | scroll | `transform` | 0.7s | `cubic-bezier(.2,.8,.2,1)` | — |
| Link | hover | `color` | 0.2–0.25s | `ease` | — |

### Three easings, one config

The reference's ~14 distinct transition declarations collapse to three curves.
Centralising them in `src/lib/motion.ts`:

```ts
export const EASE = {
  spring:     [0.3, 1.4, 0.5, 1],   // overshoot — hover, press, pill
  decelerate: [0.2, 0.8, 0.2, 1],   // arrival — reveals, panels, accordion
  draw:       [0.65, 0, 0.25, 1],   // stroke draw-on
} as const;

export const DUR = {
  fast: 0.25, tap: 0.35, hover: 0.5, panel: 0.7, reveal: 0.9, draw: 1.25,
} as const;

export const STAGGER = { letter: 0.07, item: 0.06 } as const;
```

### Constraint compliance
- Animates **only `transform` and `opacity`** — plus `stroke-dashoffset`, which
  is paint-only on the compositor and causes no reflow.
- `grid-template-rows` on the accordion is the one exception in the reference.
  **I will replace it** with a transform/clip-path accordion to honour your
  "transform and opacity only" rule and keep CLS at 0.
- All four decorative loops (`wave`/`sway`/`twinkle`/`shimmer`) are purely
  ornamental and will be **cut** — they fail `excessive-motion` (max 1–2
  animated elements per view) and add battery cost for no meaning.
- `prefers-reduced-motion`: `gsap.matchMedia()` renders every final state
  immediately, per the skill's GSAP guidance. Headings render as solid filled
  text rather than undrawn outlines — an undrawn outline with motion disabled
  would be invisible text, an accessibility failure.

---

## 4. Section → content mapping

| # | Reference section | Your content | Verdict |
| --- | --- | --- | --- |
| 01 | Cover | `site.headline`, `site.subhead`, `site.stats` (4) | **Keep.** The 4 stats become the stacked colour folders — the reference numbers its folders 01/03/05, you have exactly 4 numbers worth showing. |
| 02 | Catalogs | *(none — navigational)* | **Keep, new content.** Chapter index of the page itself. Cheap to build, and it is the device that makes a long scroll feel authored. |
| 03 | About Me | `portrait.jpg`, About narrative (3 ¶), `experience[]`, `education[]` | **Keep.** Tilt card ← portrait. Credential chips ← role/period. Timeline ← experience bullets. |
| 04 | Works | 8 projects, 6 screenshots, `/work/<slug>` pages | **Keep — strongest fit.** Filter pills ← derived families. Details sheet ← existing case-study content. |
| 05 | Process | `Approach.tsx` — 4 numbered phases | **Keep — exact 1:1.** Reference has 4 step tabs; you have precisely 4 phases (Find the bottleneck / Architect for failure / Gate anything public / Hand it over). |
| 06 | Kind Words (testimonials) | **NOTHING** | **⚠️ CUT — see below.** |
| 07 | Contact | `site.email`, `site.phone`, `site.linkedin`, résumé PDF | **Keep.** Copy-email toast (`ftp-toast`) is worth taking. |

### ⚠️ Section 06 has no content — proposal

You have **zero testimonials**, and I will not invent them. Fabricated praise on
a portfolio aimed at enterprise buyers is the single fastest way to lose
credibility, and it is the kind of thing that gets checked.

**Proposed replacement: "Production Safeguards".** You already have six real
entries in `Approach.tsx` — human approval 100%, AES-256-GCM session storage,
rate caps + send windows, 7-gate ad-policy check, RBAC at the data layer,
idempotent re-runnable jobs. They fit the three-card gradient rhythm (6 items =
3×2), they are genuinely differentiating, and they are true.

Alternatives if you prefer: **(b)** move `Stack` here as a chapter of its own,
**(c)** cut section 06 entirely and run six chapters. My recommendation is the
safeguards panel — it is the content a client actually weighs.

### Filter taxonomy for Works

30 raw stack tags is too many for a filter row (`overflow-menu`). Proposed six:

`All (8)` · `Data Infra (2)` · `AI Agents (2)` · `Product / SaaS (2)` ·
`Frontend / 3D (1)` · `Archive (3)`

Derived from existing fields — no new content required.

---

## 5. Open decisions — I need your call

**① The colour problem.** The folder metaphor depends on four distinct hues
(blue / green / cream / orange). Your identity is near-black plus one green.
Literal translation would either dilute your brand or produce muddy folders on
a dark ground.

- **(a) Tonal folders (recommended).** Folders differentiate by elevation and
  tonal shade (`#0e1012` → `#191d21`), accent reserved for the active tab.
  Keeps your identity exactly. Quieter than the reference.
- **(b) Restrained four-hue set.** Add three dark-compatible hues alongside
  `#4ade80` (e.g. slate-blue, amber, clay) used **only** on folder tabs. Closer
  to the reference's energy; dilutes the single-accent discipline.
- **(c) Invert to light.** Closest to the reference, discards the instrument-panel
  identity entirely.

**② The existing WebGL hero.** The reference cover has no 3D. You have a working
particle hero, and "showcase 3D/frontend craft" was one of your three stated
goals. Recommend **keeping it as the cover folder's backdrop**, behind the
display word, with the folder cards layered over — it is your differentiator and
the reference's cover is otherwise flat. Say if you would rather drop it.

**③ Scope.** This rebuilds the live site's entire front end. Recommend building
on a `redesign/folder-tab` branch so `main` keeps serving the deployed site
until you approve the result. Deploy previews per push once GitHub is connected.

**④ CJK pairing.** The reference pairs Latin outline with Chinese solid
(`PORTFOLIO` / `設計作品集`). That rhythm is load-bearing. Without a second
script we can pair outline Latin with a mono "slug" (`WORKS` / `08 PROJECTS ·
2024–2026`). Confirm you do not want actual CJK.

---

## 6. Dependencies

| Package | Status | Note |
| --- | --- | --- |
| `gsap` | **NEW** — listed in brief, so pre-authorised | ScrollTrigger + SplitText. SplitText ships with 3.13+; review its licence. |
| `lenis` | Already in `package.json`, unused | Wire it up. |
| `framer-motion` | Already installed | Becomes redundant — propose removing after migration. |
| `three`, `@react-three/*` | Already installed | Keep only if ② = keep hero. |

Nothing else will be added without asking.

---

## 7. Verify plan (Phase 3)

- Side-by-side build vs reference at 1440 / 768 / 390.
- Motion deviation list checked against §3's table.
- Lighthouse mobile, target ≥90 Performance and Accessibility.
- Contrast audit: 4.5:1 body, 3:1 non-text — dark mode verified independently,
  not inferred from light values.
- CLS < 0.1 verified with the draw-on headings active.

---

## Awaiting approval

Specifically: **①** colour approach, **②** keep or drop the 3D hero,
**③** branch or build on `main`, **④** CJK confirmation, and the
**section 06 replacement**. Default to recommendations and I will start at
section 01 and commit per section.
