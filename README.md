# hireyourhr.com

Marketing website for **Hire Your HR**, a Human Capital Management firm providing back-office
HR and operational support to small businesses in the USA. Static, hand-built, no build step.
Deployed to GitHub Pages from the repo root on push to `main`.

- Live: https://www.hireyourhr.com/
- Conventions and design system: see [CLAUDE.md](CLAUDE.md)
- Decisions and rationale: see [DECISIONS.md](DECISIONS.md)
- Previous site (archived, not crawled): [`archive/`](archive/)

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000/
```

## Structure

`index.html` `about.html` `services.html` `why-us.html` `faq.html` `contact.html`
`404.html`, plus `css/styles.css`, `js/main.js`, self-hosted `fonts/`, brand `imgs/`,
`robots.txt`, `sitemap.xml`, `site.webmanifest`.
