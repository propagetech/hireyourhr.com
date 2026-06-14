# Hire Your HR website: conventions and design system

Hire Your HR is a Human Capital Management firm providing back-office HR and operational
support to small businesses in the USA. This repo is the public marketing site, deployed
to GitHub Pages from the repo root.

This file documents how the site is built so future changes stay consistent. Read it
before editing.

## What this site is

- A hand-built, static, multi-page site. No framework, no build step, no bundler.
- Audience: small-business owners, founders and operations or finance leaders in the USA
  who need reliable HR and back-office support without building a full in-house HR team,
  including businesses hiring across borders who need immigration support.
- Four service groups, always capitalised and named exactly like this: HR strategy and
  advisory; Policies and documentation; Compliance and immigration; Back-office and
  operations.
- Lead messaging: around 20 years of experience; a team qualified in HR, law and
  immigration; a partnership model focused on the best return on HR spend.
- Contact is email-led: `info@hireyourhr.com`. There is no backend and no server form.
- Canonical domain: `https://www.hireyourhr.com/`.

## File layout

```
/                       site root (GitHub Pages serves from here)
  index.html            Home (ProfessionalService + WebSite JSON-LD), served at /
  about/index.html      About: story, vision, values (BreadcrumbList), at /about/
  services/index.html   Services, 4 pillars #strategy #policies #compliance #operations (Service ItemList), at /services/
  why-us/index.html     Why us / how we work: partnership, team, steps (BreadcrumbList), at /why-us/
  faq/index.html        FAQ accordion (FAQPage JSON-LD), at /faq/
  contact/index.html    Email-led contact + mailto helper (BreadcrumbList), at /contact/
  404.html              Styled, noindex, stays at root, uses absolute (/...) asset paths
  css/styles.css      The single design-system stylesheet
  js/main.js          Progressive enhancement only (nav, accordion, mailto helper)
  fonts/              Self-hosted woff2 (Inter + Source Serif 4, latin subset)
  imgs/
    logo-hireyourhr.webp   Brand logo (reused; brand colours derived from it)
    favicon.svg, favicon-*.png, apple-touch-icon.png, og-image.png/.jpg
    illustrations/    unDraw SVGs recoloured to the brand palette
  robots.txt          Allows all, disallows /archive/, points to sitemap
  sitemap.xml         All six public pages (lastmod auto-bumped on deploy)
  site.webmanifest    PWA manifest
  archive/            The previous Viamagus/ProPage site, kept verbatim. Do not link to it.
  .github/workflows/deploy.yml   GitHub Pages deploy (uploads repo root)
```

## Brand and design tokens

Brand colours are derived from `imgs/logo-hireyourhr.webp`: a signal red `#E11D24` (the
two-people "H" mark) paired with a deep charcoal `#181C24` anchor and warm cream neutrals.
Red is the accent that gives the brand energy; charcoal carries dark sections and primary
buttons; this keeps the site human and trustworthy rather than clinical. All colour tokens
live in `:root` in `css/styles.css`.

Key tokens (all text/UI pairs audited to WCAG 2.1 AA, see the contrast table below):

| Token            | Hex       | Use                                            |
|------------------|-----------|------------------------------------------------|
| `--char`         | `#181C24` | Headings, dark sections, primary button        |
| `--char-2`       | `#232A36` | Gradient partner for dark sections             |
| `--ink`          | `#1D212A` | Body text on light                             |
| `--muted`        | `#585F6E` | Secondary text on light                        |
| `--red`          | `#E11D24` | Brand accent; red button bg (white text)        |
| `--red-deep`     | `#BE1822` | Red-toned links, icons, borders on light        |
| `--red-light`    | `#F3A9AD` | Eyebrows / links / accents on charcoal         |
| `--cream`        | `#F7F5F2` | Soft section background                        |
| `--on-dark-muted`| `#C7CCD6` | Secondary text on charcoal                     |
| `--foot-muted`   | `#AAB1BD` | Footer secondary text on charcoal              |

Contrast (foreground / background, ratio, requirement):

- ink / white = 16.1, ink / cream = 14.8 (AA text, need 4.5)
- muted / white = 6.4, muted / cream = 5.9 (AA text)
- red-deep / white = 6.3, red-deep / cream = 5.8 (AA text and AA UI)
- white / red button = 4.8 (AA text)
- white / charcoal = 17.1 (AA text)
- red-light / charcoal = 9.0, on-dark-muted / charcoal = 10.6, foot-muted / charcoal = 7.9 (AA text)
- red / white = 4.8, red / cream = 4.4 (AA non-text UI, need 3.0)

Rule of thumb: full-strength red (`#E11D24`) is fine as a button background with white text
and as a non-text UI accent, but NOT as small red text on white (it sits near the 4.5 line).
For red-coloured text, links or icons on a light background use `--red-deep`; on charcoal use
`--red-light`. Re-audit any new colour pair before shipping.

## Typography

- Headings: "Source Serif 4" (refined serif, signals experience and warmth).
- Body / UI: "Inter".
- Both are self-hosted variable woff2, latin subset, preloaded, `font-display: swap`.
  No Google Fonts link, no external CDN requests anywhere on the site.
- Type scale is fluid via `clamp()` (see `--fs-*` tokens). Do not hardcode font sizes in
  pages; use the tokens or existing component classes.

## Illustrations

- Sourced from https://undraw.co/ and recoloured to the brand. The unDraw accent maps to
  brand red `#E11D24`; the dark figure tones map to charcoal `#2C3340`/`#12151B`; the soft
  secondary maps to a warm neutral; skin tones and neutral greys are preserved. Recoloured
  files live in `imgs/illustrations/`. The colour map is in `DECISIONS.md`.
- Always give `<img>` a meaningful `alt`, explicit `width`/`height` (from the SVG viewBox)
  to avoid layout shift, and `loading="lazy"` for anything below the fold. The single
  above-the-fold hero illustration uses `fetchpriority="high"` and is preloaded, not lazy.
- Illustrations sit on light/cream backgrounds so the line-work stays legible; dark
  charcoal sections are kept typographic instead.

## Accessibility (WCAG 2.1 AA) conventions

- One `<h1>` per page; headings nest in order. Landmarks: one `<header>`, one
  `<main id="main">`, one `<footer>`; `<nav>` elements are labelled.
- Every page starts with a `.skip-link` to `#main`.
- Visible focus styles via `:focus-visible` (charcoal on light, lighter rings on dark). Do
  not remove focus outlines.
- The mobile nav and the FAQ accordion are keyboard operable. The accordion uses native
  `<details>`/`<summary>` so it works with JS off; JS only adds single-open behaviour.
- `prefers-reduced-motion` is respected globally.

## SEO conventions

- **URL convention: directory ("pretty") URLs.** Each page is a folder with
  `index.html`, served at a trailing-slash path (`about/index.html` at `/about/`).
  Home is `index.html` at the root, served at `/` (do not create a `home/` folder);
  `404.html` stays at the root. Two invariants make this work: assets are root-absolute
  (`/css/...`, `/js/...`, `/fonts/...`, `/imgs/...`, `/site.webmanifest`), and internal
  links and canonicals use the `/slug/` form (never `/slug.html`). `/slug` 301-redirects
  to `/slug/`, so always link with the trailing slash. New page = `slug/index.html`.
- Every page has a unique `<title>`, meta description, `<link rel="canonical">`, and
  Open Graph + Twitter tags. Keep these unique per page when adding content.
- JSON-LD per page type: Home has `ProfessionalService` + `WebSite`; inner pages have
  `BreadcrumbList`; Services adds a `Service` `ItemList`; FAQ adds `FAQPage`.
  If you change visible FAQ copy, update the matching `acceptedAnswer` text so they stay in
  sync (Google requires the structured answer to match the page).
- Add new pages to `sitemap.xml` and to the footer nav.

## Contact and privacy

- No server-side form. `contact.html` has a client-side helper that composes a `mailto:`
  draft in the visitor's own mail app (`js/main.js`); nothing is sent or stored by the site.
- Every page states that contact is email-led and nothing is stored on the website. Keep
  this note when editing contact-related copy.

## Copy rules

- No em dashes anywhere. Use commas, colons or parentheses. Verify with
  `grep -rn $'—' *.html css js` (must return nothing).
- British or US spelling is fine but be consistent within a page; the existing copy leans
  British (`specialise`, `organised`, `tailor-made`) while keeping common terms like
  `back-office`, `onboarding`, `off-boarding`.
- Service group names are always: HR strategy and advisory; Policies and documentation;
  Compliance and immigration; Back-office and operations.
- Use "around 20 years" rather than asserting an exact founding year (none confirmed).

## Deploy

- `.github/workflows/deploy.yml` deploys the repo root to GitHub Pages on push to `main`.
  It rewrites every `<lastmod>` in `sitemap.xml` to the deploy date.
- Keep the site at the repo root. `archive/` ships with the deploy but is disallowed in
  `robots.txt`, so it will not be crawled.

## Local preview

```
python3 -m http.server 8000
# then open http://localhost:8000/
```
