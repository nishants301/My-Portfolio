# Nishant Shekhar — Portfolio

A 3D portfolio for an AI Systems Engineer. Built for two audiences at once:
enterprise clients evaluating whether to hand over a project, and hiring
managers who will skim it in thirty seconds.

**Stack:** Next.js 15 (App Router) · React 19 · React Three Fiber · Three.js ·
Tailwind CSS v4 · TypeScript

---

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build, all pages static
npm start
```

---

## How it is put together

```
src/
  app/
    layout.tsx           Fonts, metadata, nav shell
    page.tsx             Home — composes the sections, emits JSON-LD
    globals.css          The whole design system (tokens + primitives)
    work/[slug]/page.tsx Case study template, statically generated per project
  components/
    three/               WebGL — ParticleField (shaders), HeroCanvas (mount + fallback)
    sections/            Hero, Stats, Work, Approach, Stack, About, Contact
    ui/                  Nav, Reveal, ProjectCard, ShotFrame
  data/
    site.ts              Bio, stats, skills, experience, education
    projects.ts          All project case-study content
  lib/hooks.ts           Reveal, scroll progress, capability detection
```

### Content lives in `src/data/`

Nothing in the components needs editing to change what the site says. Add a
project by appending to the `projects` array in `src/data/projects.ts` — the
home page list, the archive index and the `/work/<slug>` case study page are
all generated from it. Set `featured: true` to promote it to a full card.

---

## Design system

Defined once as CSS custom properties in `globals.css`, consumed as Tailwind
tokens (`bg-ground`, `text-ink-dim`, `border-rule`, `text-signal`).

| Token | Value | Role |
| --- | --- | --- |
| `ground` | `#08090a` | Page background — near-black, never pure black |
| `surface` / `panel` | `#0e1012` / `#131619` | Raised regions |
| `rule` | `rgba(255,255,255,0.07)` | Hairline borders |
| `ink` / `ink-dim` / `ink-faint` | `#ecedee` / `#9ba1a6` / `#5f666c` | Type hierarchy |
| `signal` | `#4ade80` | The one accent. Used sparingly, on purpose |

Type is Inter (display + body) with JetBrains Mono for data labels and
metadata. Numbers are always set in mono — they read as instrument output.

---

## Performance notes

- **Three.js is dynamically imported** (`ssr: false`), so it stays out of the
  initial bundle. First load JS is ~117 kB.
- **DPR is clamped to 1.6.** Rendering a soft particle field at 3× costs nine
  times the fragments for no visible gain.
- **The hero degrades deliberately.** `useCanRender3D()` checks for a WebGL
  context, `prefers-reduced-motion` and CPU cores, and renders a static
  gradient instead when any of them says no. A hero running at 12 fps reads as
  worse engineering than no hero.
- **Reveals use one IntersectionObserver each and disconnect after firing.**
- **Card tilt writes transforms inside rAF**, not React state, so a list of
  cards does not re-render on every mousemove.

---

## Screenshots

`public/shots/` holds captures of the live products, taken by:

```bash
node scripts/capture.mjs           # public marketing sites
node scripts/capture-redacted.mjs  # Swiggy dashboard, client data blurred
```

> **The Swiggy dashboard capture is redacted on purpose.** The live page shows
> named client outlets and their real revenue. `capture-redacted.mjs` blurs
> outlet names and every numeric cell in-page *before* the screenshot is taken,
> so no readable client data ever reaches an image file. If you re-capture that
> page, use the redacted script — never `capture.mjs`.

Playwright drives installed Edge (`channel: "msedge"`) because the bundled
Chromium download is blocked on this machine.

---

## Deploying

Hosted on Vercel, deployed from `main`. Vercel auto-detects Next.js, so there
is no build configuration to supply.

**First deploy:** vercel.com -> Add New -> Project -> import
`nishants301/My-Portfolio`. Leave every setting at its default and deploy.

**Custom domain:** Project -> Settings -> Domains -> add the domain, then point
DNS at Vercel (an `A` record to `76.76.21.21` for an apex domain, or a `CNAME`
to `cname.vercel-dns.com` for `www`). HTTPS is provisioned automatically.

**After the domain is live**, set the canonical URL — otherwise canonical tags,
the sitemap and Open Graph images keep pointing at the `.vercel.app` URL:

```
Settings -> Environment Variables -> Production
NEXT_PUBLIC_SITE_URL = https://yourdomain.com
```

Then redeploy. Until it is set, `src/lib/url.ts` falls back to Vercel's own
`VERCEL_PROJECT_PRODUCTION_URL`, so nothing is broken in the meantime.

Preview deployments return `Disallow: /` from `robots.ts`, so they never
compete with the real domain in search results.

### Share image

`public/og.png` (1200x630) is what unfurls in WhatsApp, LinkedIn and Slack.
Regenerate it after changing the headline or the stats:

```bash
node scripts/make-og.mjs
```

---

## Redaction rules

Every published screenshot has been processed. **Do not replace one in
`public/shots/` with a raw capture.**

| Shot | Treatment |
| --- | --- |
| `swiggy-analytics.png` | Outlet names and all revenue cells blurred in-page before capture (`capture-redacted.mjs`) |
| `propalate-os.png` | Business metric lines blurred (`blur-regions.mjs`) |
| `reel-pipeline.png` | Every avatar face blurred (`blur-faces.mjs`) |
| `replyji.png`, `plateful-technologies.png`, `agent-fleet.png` | Public marketing pages / no sensitive content — unmodified |

Raw sources live in `Downloads/` which is **gitignored**, because they contain
recognizable faces and named client revenue. Keep it that way.

### Tools

```bash
# Blur explicit regions, coordinates as 0-1 fractions of width/height
node scripts/blur-regions.mjs in.png out.png --rect=x,y,w,h --blur=11

# Blur every thumbnail in a detected card grid (faces)
node scripts/blur-faces.mjs in.png out.png [--blur=26] [--thumb=0.74] [--all]
```
