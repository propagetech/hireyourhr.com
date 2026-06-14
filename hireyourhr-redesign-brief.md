# Redesign brief: Hire Your HR, Human Capital Management website

Use this as the kick-off prompt for the redesign. Paste it to Claude in the `hireyourhr.com` project, then say "go".

## Kick-off instruction (the short version)
> Move the current website into an `archive/` folder and build a new website in its place. Standards: SEO, semantic HTML5, schema.org with valid JSON-LD for Google rich results, WCAG 2.1 AA, world-class international-standard UX/UI, fully responsive, fast static stack with self-hosted fonts (no external CDN requests), and https://undraw.co/ illustrations themed to the brand. No em dashes anywhere in the copy. Deploy stays GitHub Pages from the repo root.

Everything below is the detail to work from.

## 1. What Hire Your HR is
**Hire Your HR** is a **Human Capital Management firm** in the HR consulting space. With around **20 years of experience**, it provides **back-office HR and operational support to small businesses in the USA**, so owners can focus on revenue-generating activities.

- Mission: facilitate organisations with the HR and operational support they need, address their pain areas, and free them to focus on growth.
- Vision: to be a dependable HR and operations partner for small businesses (confirm the exact wording with the client).
- Differentiators: deep experience (about 20 years); a team qualified in **HR, law and immigration**; agile, tested services; a true partnership model focused on the best return on HR spend.
- Current site: a single-page Viamagus/ProPage brochure export (`index.html` + `404.html`) with sections About Us (Our Story, Our Vision), Our Services, Why We and How We Work, Contact Us. Heavy builder JS, generic layout, no SEO/schema depth, no accessibility story.
- Contact email: **info@hireyourhr.com**. (No phone listed; add one if the client provides it, otherwise lead with email.)
- Logo: `imgs/logo-hireyourhr.webp` (reuse it; take the brand colours from it).
- Domain: **https://www.hireyourhr.com/** (matches the existing sitemap).

## 2. Audience and positioning
Target readers: small-business owners, founders, and operations or finance leaders in the US who need reliable HR and back-office support without building a full in-house HR team. Also businesses hiring across borders who need immigration support and compliance.

Position Hire Your HR as: an experienced, hands-on HR and operations partner that takes the back-office burden off small businesses and keeps them compliant. Tone: credible, practical, reassuring, partnership-minded. Lead with the 20 years of experience and the law/immigration depth as trust signals. Emphasise outcomes (less admin burden, compliant hiring, audit-ready documentation, more time for revenue) over activities.

## 3. Information architecture
Move from one long page to a clear, multi-page structure:
1. **Home** - hero, what we do, value pillars, services snapshot, why-us/experience band, how-we-work, and a contact call to action.
2. **About** - Our Story and Our Vision, the 20-year track record, the team's HR/law/immigration expertise, and values.
3. **Services** - one page covering the full range with anchors, each with a short overview and a "what you get" list.
4. **Why us / How we work** - the partnership model, the experienced multi-disciplinary team, and the engagement approach (can be its own page or a strong Home section plus an About subsection).
5. **Insights / FAQ** - a small FAQ (great for rich results) plus optional articles; can start as just an FAQ section.
6. **Contact** - clear ways to start an engagement.

Keep the nav to about six items plus a primary call-to-action button (for example "Talk to us" or "Get HR support").

## 4. Services (carry these over, grouped)
The current site lists a full range of tailor-made HR and operational services. Group them so the page scans well:
- **HR strategy and advisory:** HR gap analysis; forming HR strategy; performance evaluation.
- **Policies and documentation:** drafting and revising contracts, handbooks and policies; onboarding and off-boarding; managing exits.
- **Compliance and immigration:** immigration support and compliance; contract management.
- **Back-office and operations:** timesheets, invoices, and day-to-day operational support.

For each service: a one-line promise, a short paragraph, and a 3 to 5 item "what you get" / "typical scope" list. Tie language to outcomes (audit-ready handbooks, compliant hiring, smooth onboarding, less admin, better return on HR spend).

## 5. Design direction
- **Brand:** derive 2 to 3 brand colours from `imgs/logo-hireyourhr.webp`. HR/professional-services palettes work well in a confident blue or teal with a warm accent; keep it human and trustworthy, not clinical. Verify every text and UI colour pair against WCAG (text >= 4.5:1, UI borders/focus/icons >= 3:1).
- **Typography:** a strong, credible pairing. A refined serif or humanist sans for headings (for trust and warmth) with a highly legible sans (Inter is a safe body choice). Self-host woff2 (latin subset), preload the critical weights, no Google Fonts link.
- **Illustrations:** pull relevant illustrations from https://undraw.co/ (people, teamwork, agreement, documents, onboarding, checklist, remote work, growth), download the SVGs locally, and recolour the unDraw accent to the brand colour so they feel on-brand.
- **Components:** hero, value pillars, service cards, a "how we work" steps block, an FAQ accordion, an experience/trust band (lead with "20 years"), and a clean contact section. Generous spacing, large readable type, clear hierarchy.

## 6. Standards and technical requirements
- **Stack:** hand-built static HTML5 + one design-system CSS file (custom properties) + one small vanilla JS file (progressive enhancement; the site must work with JS off). No framework, no build step.
- **SEO:** unique title, meta description, canonical, Open Graph and Twitter tags per page; clean descriptive URLs; a real `robots.txt` and a full `sitemap.xml`.
- **Schema.org (JSON-LD), valid for Google rich results:** `Organization` / `ProfessionalService` (name, logo, url, contactPoint, address, sameAs, foundingDate or yearsInOperation if used) and `WebSite` on Home; `BreadcrumbList` on inner pages; a `Service` `ItemList` on the services page; and a `FAQPage` on the FAQ (the most likely rich-result win). Validate every JSON-LD block parses.
- **Accessibility (WCAG 2.1 AA):** semantic landmarks, one h1 per page, ordered headings, a skip link, visible focus rings (light on dark sections), keyboard-operable nav/accordion, alt text on imagery, and verified colour contrast. Respect `prefers-reduced-motion`.
- **Performance (Core Web Vitals):** self-hosted assets, preloaded hero image and fonts, lazy-loaded below-the-fold images, minimal non-blocking JS, no layout shift (set image width/height).
- **Contact:** if there is no backend, do not use a server form (spam risk). Use a clear email-led contact, or an email-draft helper that composes a `mailto:` from the visitor's own mail app, plus a prominent email and (if provided) phone. State that nothing is stored on the site.
- **Nice-to-have:** a floating WhatsApp or email button bottom-right if the client wants quick contact.
- **Deploy:** the repo already deploys to GitHub Pages from the root on push to `main` (`.github/workflows/deploy.yml`). Keep the new site at the repo root so this keeps working. Archive the old site under `archive/` and disallow `archive/` in `robots.txt`.

## 7. Copy and quality conventions
- Rewrite copy for clarity and outcomes; fix any generic builder text.
- **No em dashes (`—`).** Use commas, colons or parentheses. (Verify with `grep -rn "—"`.)
- Consistent terminology and capitalisation for service names.
- Keep the hero short enough to fit the first screen without scrolling.
- Document the design system, conventions and decisions in a `CLAUDE.md` and a short decisions log for future development.

## 8. Source content to reuse
- About / Our Story: "Hire Your HR is a Human Capital Management Firm working towards excellence in the Consulting space. With around 20 years of strong experience, Hire Your HR provides back-office support to small businesses in USA. Our mission is to facilitate organisations with much needed HR and operational support which can address the pain areas and enable them to focus on the revenue generating activities."
- Services: "a full range of tailor-made Human Resource and Operational services... HR Gap analysis, forming HR strategy, drafting and revising contracts, handbooks, policies, onboarding, off-boarding, performance evaluation, managing exits, contract management, immigration support and compliance, timesheets, invoices."
- Why we: "Our team consists of professionally qualified, long-experience members in Human Resources, law and Immigration... services are agile and tested to suit your business environment."
- How we work: "We work with our clients as partners and with each other as a team. Our advice and solutions are shaped by each client's unique needs and business context and are designed to ensure that clients get the best return on their HR spend."
- Email: info@hireyourhr.com. Logo: `imgs/logo-hireyourhr.webp`.

## 9. Definition of done
- Old site archived; new responsive static site at the repo root.
- All pages: valid JSON-LD, unique SEO meta, AA contrast (audited), keyboard-accessible, no em dashes.
- Lighthouse-friendly (fast, no CLS), works with JS disabled.
- `robots.txt`, `sitemap.xml`, `site.webmanifest`, favicon, and a styled 404 in place.
