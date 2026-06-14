# Decisions log

A short record of the choices made when rebuilding the Hire Your HR site, so future work
has the reasoning, not just the result. Newest first.

## 2026-06-14: Made URLs path-portable (relative) for the github.io preview

The preview deploy is a GitHub Pages project page at
`https://propagetech.github.io/hireyourhr.com/` (served under the `/hireyourhr.com/`
subpath, not a domain root). The directory-URL step had used root-absolute asset paths
(`/css/...`), which resolve to the github.io root on a project page and 404, so the
preview would render unstyled. Converted assets and internal links to depth-aware
**relative** paths (home `css/...`, `about/`; inner pages `../css/...`, `../services/`,
home link `../`), which work at both a domain root and a project subpath. Also fixed two
footer links the migration had left relative-but-broken from sub-folders: the Sitemap
link (`sitemap.xml` to `../sitemap.xml`) and the Home link (`index.html` to `../`).
`404.html` stays root-absolute; canonical/OG/sitemap/JSON-LD stay absolute on the
production domain. Verified with a headless-Chrome subpath simulation (0 failed requests,
CSS loaded, nav navigates correctly) and the production-root contrast audit still passes
(381 text elements). CLAUDE.md SEO conventions updated accordingly.

## 2026-06-14: Switched to directory ("pretty") URLs

Each page became a folder with `index.html`, served at a trailing-slash path
(`about.html` is now `about/index.html` at `/about/`). Home stays at `/` and `404.html`
stays at the root. Done pre-launch, when the change is cheap. The migration rewrote
every asset path to root-absolute (`/css/...`, `/imgs/...`), moved every internal link
and canonical to the `/slug/` form, and updated `sitemap.xml`. Verified: directory URLs
serve 200, `/slug` 301-redirects to `/slug/`, the link/anchor check passes, JSON-LD
parses, and the contrast audit still passes (381 text elements). The rule is documented
in CLAUDE.md (SEO conventions). Note: if old `/slug.html` URLs were already indexed,
add redirects, since they 404 after the move.

## 2026-06-14: Verified AA contrast and guarded the eyebrow cascade

Added a DOM-aware contrast audit (`tools/contrast-audit.mjs`) that loads every page in
real Chrome and checks the computed foreground against the composited background of
every text element (it resolves gradient sections by averaging their colour stops, so a
dark gradient is not mistaken for white). Result: all pages pass WCAG 2.1 AA, 0 failures
across 381 text elements. A token/palette table cannot see the cascade, so this browser
audit is the authoritative check: run it after any colour or markup change
(`python3 -m http.server 8123`, then `node tools/contrast-audit.mjs`).

Rule adopted, **colour belongs to the component, not the container**: a container
selector like `.section-head p` (specificity 0-1-1) silently out-specifies the
single-class `.eyebrow` (0-1-0) nested inside it, repainting the eyebrow with `--muted`
instead of the brand red. It did not fail contrast here, but it was off-brand and is the
exact root cause that produced a real 1.39:1 failure on a sister site. Fixed by scoping
the rule to `.section-head p:not(.eyebrow)` so eyebrows render their accent colour
everywhere. Never let a container rule override a component colour class.

## 2026-06-14: Full rebuild

**Archived the old site.** The previous single-page Viamagus/ProPage brochure export
(`index.html`, `404.html`, builder `css/`, `js/`, `fonts/`, `imgs/`, and the `rename-*`
artifacts) was moved verbatim into `archive/` so the old deploy history is preserved and the
page still renders from its own self-contained assets. `archive/` is disallowed in
`robots.txt`. The logo (`imgs/logo-hireyourhr.webp`) was copied back to the root `imgs/`
because the new site reuses it.

**Stack: hand-built static, no build step.** Six HTML pages, one CSS design-system file, one
small vanilla JS file. Rationale: matches the GitHub Pages root deploy already in place, has
no toolchain to maintain, and is the fastest, most robust option for a brochure site. The
site is fully usable with JavaScript disabled.

**Brand palette: red from the logo + a charcoal anchor.** The logo is a near-black wordmark
with a signal red two-people "H" mark; colours were sampled directly from
`imgs/logo-hireyourhr.webp` (core red `#E81820`, sampled average `#E33038`). Red alone sits
close to the contrast line as small text on white, and an HR brand reads as more credible and
human with a deep, calm anchor, so red was paired with charcoal `#181C24` and warm cream
neutrals. Red is used as a button background (with white text), as a decorative accent, and
on charcoal; `--red-deep` / `--red-light` are the AA-safe red text variants for light / dark
backgrounds. Every text and UI colour pair was audited to WCAG 2.1 AA before use (table in
`CLAUDE.md`).

**Typography: Source Serif 4 (headings) + Inter (body).** A refined serif signals experience
and warmth, which suits a 20-year HR firm; Inter is a highly legible body sans. Both are
self-hosted as latin-subset variable woff2 (Inter ~48KB, Source Serif 4 ~51KB), preloaded,
with `font-display: swap`. No Google Fonts link and no external CDN requests, per the brief.

**Illustrations: unDraw, recoloured to brand.** SVGs were recoloured with this map (skin
tones and neutral greys preserved):

| Source (unDraw accent / dark) | Brand |
|-------------------------------|-------|
| `#0f2741` accent | `#E11D24` red |
| `#274060` / `#14304f` | `#2C3340` charcoal |
| `#090814` / `#2f2e41` | `#12151B` near-black |
| soft secondary | `#E9E3DA` warm neutral |

Recoloured files live in `imgs/illustrations/`. They sit only on light/cream backgrounds so
the line-work stays legible; dark charcoal sections are kept typographic instead. To add an
illustration, apply the same map and keep `width`/`height` on the `<img>`.

**Brand raster assets generated with Pillow.** The favicon mark (a red rounded square with a
white two-people "H", echoing the logo) was drawn programmatically and exported at 32, 180,
192 and 512 px, with a matching hand-written `favicon.svg`. The 1200x630 `og-image` places
the real logo on a white card over a charcoal field with a serif tagline, mirroring the site.

**Information architecture: six pages.** Home, About, Services (one page, four pillar
anchors), Why us (partnership, team, how-we-work steps), FAQ, Contact. This keeps the nav to
six items plus a "Talk to us" call to action, and gives each rich-result schema a natural
home.

**Schema.org coverage.** Home: `ProfessionalService` (an `Organization` subtype with name,
logo, url, email, areaServed, knowsAbout, serviceType, contactPoint) plus `WebSite`. Inner
pages: `BreadcrumbList`. Services: a `Service` `ItemList` of the four service groups. FAQ:
`FAQPage` (the most likely rich-result win). No physical address or phone was provided, so
neither was invented; `areaServed` is the United States and contact is email via
`contactPoint`. No `foundingDate` was asserted because only "around 20 years" is confirmed.

**Contact: email-led, no backend.** There is no server, so there is no POST form.
`contact.html` offers a prominent `mailto:` plus a client-side helper that composes a draft in
the visitor's own email app. Every page states contact is email-led and nothing is stored on
the site. A floating email button (the brief's nice-to-have) appears bottom-right.

**FAQ accordion: native `<details>`/`<summary>`.** Works without JS and is keyboard
accessible by default; JS only adds the convenience of keeping one item open at a time.

**Copy.** Rewritten for clarity and outcomes, reusing the client's Our Story, Our Vision, Why
we and How we work text. Service names are consistent across the site. No em dashes anywhere.
