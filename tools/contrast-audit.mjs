/**
 * DOM-aware WCAG contrast audit.
 *
 * Why this exists: a palette/token table only proves colours pass *in isolation*.
 * Real failures come from the cascade (which rule wins) and from which ancestor
 * actually paints the background. This loads each page in a real browser and, for
 * every visible text element, reads the COMPUTED foreground colour and the
 * COMPOSITED background behind it, then checks the WCAG 2.1 AA ratio.
 *
 * Usage:
 *   1) serve the site:   python3 -m http.server 8123
 *   2) install once:     (cd tools && npm i playwright-core)   # uses installed Chrome
 *   3) run:              node tools/contrast-audit.mjs [baseUrl]
 *
 * Reusable across projects: copy this file + run the three steps. Exit code is 1 if
 * any AA failure is found, so it can gate CI.
 */
import { chromium } from 'playwright-core';
import { readdirSync } from 'node:fs';

// Portable: pass a base URL and/or explicit /paths as args; otherwise auto-discover
// the root-level .html files of the project this is run from (archive/ is a subdir,
// so it is excluded).  e.g.  node tools/contrast-audit.mjs http://localhost:8123
const args = process.argv.slice(2);
const BASE = args.find((a) => a.startsWith('http')) || 'http://localhost:8123';
let PATHS = args.filter((a) => a.startsWith('/'));
if (!PATHS.length) {
  PATHS = readdirSync(process.cwd())
    .filter((f) => f.endsWith('.html'))
    .map((f) => (f === 'index.html' ? '/' : '/' + f))
    .sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)));
}

const audit = () => {
  // ---- runs inside the page ----
  const parse = (s) => {
    const m = (s || '').match(/rgba?\(([^)]+)\)/);
    if (!m) return { r: 0, g: 0, b: 0, a: 0 };
    const p = m[1].split(',').map((x) => parseFloat(x.trim()));
    return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] };
  };
  const over = (top, bot) => ({
    r: top.r * top.a + bot.r * (1 - top.a),
    g: top.g * top.a + bot.g * (1 - top.a),
    b: top.b * top.a + bot.b * (1 - top.a),
    a: 1,
  });
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const ratio = (a, b) => { const la = lum(a), lb = lum(b), hi = Math.max(la, lb), lo = Math.min(la, lb); return (hi + 0.05) / (lo + 0.05); };

  const effBg = (el) => {
    const stack = [];
    let node = el, hasImage = false;
    while (node) {
      const cs = getComputedStyle(node);
      const bg = parse(cs.backgroundColor);
      const img = cs.backgroundImage && cs.backgroundImage !== 'none';
      if (img) hasImage = true;
      if (bg.a > 0) stack.push(bg);
      node = node.parentElement;
    }
    let base = { r: 255, g: 255, b: 255, a: 1 }; // canvas default
    for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i], base);
    return { color: base, hasImage };
  };

  const selFor = (el) => {
    const parts = [];
    let n = el;
    for (let i = 0; n && i < 4; i++) {
      let s = n.tagName.toLowerCase();
      if (n.id) { parts.unshift(s + '#' + n.id); break; }
      if (n.className && typeof n.className === 'string') s += '.' + n.className.trim().split(/\s+/).slice(0, 2).join('.');
      parts.unshift(s);
      n = n.parentElement;
    }
    return parts.join(' > ');
  };

  const results = [];
  const all = document.body.querySelectorAll('*');
  for (const el of all) {
    // only elements with their OWN visible text
    const ownText = Array.from(el.childNodes)
      .filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').replace(/\s+/g, ' ').trim();
    if (!ownText) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) === 0) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;

    const fgRaw = parse(cs.color);
    const bg = effBg(el);
    const fg = fgRaw.a < 1 ? over(fgRaw, bg.color) : fgRaw;
    const r = ratio(fg, bg.color);

    const px = parseFloat(cs.fontSize);
    const wt = parseInt(cs.fontWeight, 10) || (cs.fontWeight === 'bold' ? 700 : 400);
    const big = px >= 24 || (px >= 18.66 && wt >= 700);
    const required = big ? 3.0 : 4.5;

    results.push({
      sel: selFor(el),
      text: ownText.slice(0, 48),
      fg: `rgb(${Math.round(fg.r)},${Math.round(fg.g)},${Math.round(fg.b)})`,
      bg: `rgb(${Math.round(bg.color.r)},${Math.round(bg.color.g)},${Math.round(bg.color.b)})`,
      ratio: Math.round(r * 100) / 100,
      required, big, hasImage: bg.hasImage,
      pass: r >= required,
    });
  }
  return results;
  // ---- end in-page ----
};

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 1200 } });

let totalFail = 0, totalChecked = 0, reviewImg = 0;
for (const path of PATHS) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  const res = await page.evaluate(audit);
  totalChecked += res.length;
  const fails = res.filter((r) => !r.pass);
  const imgFails = fails.filter((r) => r.hasImage);
  reviewImg += imgFails.length;
  console.log(`\n=== ${path}  (${res.length} text elements, ${fails.length} fail) ===`);
  if (fails.length === 0) { console.log('  PASS: all text meets AA'); }
  for (const f of fails) {
    totalFail++;
    const note = f.hasImage ? ' [over image/gradient - review]' : '';
    console.log(`  FAIL ${f.ratio}:1 (need ${f.required}) ${f.fg} on ${f.bg}${note}`);
    console.log(`       ${f.sel}`);
    console.log(`       "${f.text}"`);
  }
}
// also check both nav states by toggling the mobile menu? Desktop covers links.
console.log(`\n----------------------------------------`);
console.log(`Checked ${totalChecked} text elements across ${PATHS.length} pages.`);
console.log(totalFail === 0 ? 'RESULT: PASS (no AA contrast failures)' : `RESULT: ${totalFail} AA FAILURE(S)`);
if (reviewImg) console.log(`(${reviewImg} of the failures sit over an image/gradient and may warrant a manual look.)`);
await browser.close();
process.exit(totalFail === 0 ? 0 : 1);
