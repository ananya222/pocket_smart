// scripts/ui-audit.mjs
// Desktop-only UI audit for ananyapanayappan.com
// Run: BASE_URL=http://localhost:8080 node scripts/ui-audit.mjs
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = await import(pathToFileURL(process.env.USERPROFILE + '/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs')); }
const { chromium } = playwright;
import fs from 'node:fs';

const BASE = (process.env.BASE_URL || 'http://localhost:8080').replace(/\/$/, '');
const PROD_HOST = process.env.PROD_HOST || 'ananyapanayappan.com';
const DEMO_SELECTOR = process.env.DEMO_SELECTOR || '[data-demo], .demo, .demo-box, .demo-card';
const OUT = 'ui-audit';

// Add every page you discover to the right group.
const GROUPS = {
  home: ['/index.html'],
  list: ['/research.html', '/projects.html', '/honors.html', '/venture.html', '/community.html', '/blog.html', '/contact.html', '/honors-all.html'],
  resume: ['/resume.html'],
  detail: ['/optimal-hire.html', '/pocketsmart.html', '/portfolio-resilience.html', '/indian-indices.html', '/market-volatility.html', '/beyond-gbm.html', '/project-flow.html'],
};
const DEMO_APP_PAGES = ['/pocketsmart-demo/index.html', '/pocketsmart-demo/phone.html', '/about.html', '/apps.html']; // screenshot + overflow check only

const VIEWPORTS = [[1024, 768], [1280, 720], [1366, 768], [1536, 864], [1920, 1080], [2560, 1440]]
  .map(([width, height]) => ({ width, height, name: `${width}x${height}` }));

// Runs inside the browser. Must stay self-contained.
function measure({ demoSel, prodHost }) {
  const issues = [];
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const R = el => el.getBoundingClientRect();
  const S = el => getComputedStyle(el);
  const visible = el => { const r = R(el); const s = S(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const label = el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).join('.') : '');
  const uniq = arr => [...new Set(arr)];
  const num = (a, b) => parseFloat(a) - parseFloat(b);
  const isSkip = el => !!el.closest('a[href="#main"], .skip-link, .sr-only, .visually-hidden');
  const bodyBg = S(document.body).backgroundColor;
  const hasBoundary = el => {
    const s = S(el);
    return parseFloat(s.borderTopWidth) > 0 || parseFloat(s.borderLeftWidth) > 0 || s.boxShadow !== 'none' ||
      (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== bodyBg);
  };
  const pos = el => (el ? Math.round(R(el).left * 10) / 10 : null);

  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  const main = document.querySelector('#main') || document.querySelector('main');
  if (!header) issues.push('missing <header>');
  if (!footer) issues.push('missing <footer>');
  if (!main) issues.push('missing #main / <main>');
  const root = main || document.body;
  const sizesIn = (scope, sel) => uniq([...scope.querySelectorAll(sel)].filter(visible).map(el => S(el).fontSize)).sort(num);

  // 1. Overflow
  const doc = document.documentElement;
  if (doc.scrollWidth > vw + 1) issues.push(`page scrolls horizontally (${doc.scrollWidth}px > ${vw}px)`);
  document.querySelectorAll('body *').forEach(el => {
    if (!visible(el) || isSkip(el) || S(el).position === 'fixed') return;
    const r = R(el);
    if (r.right > vw + 1 || r.left < -1) issues.push(`outside viewport: ${label(el)}`);
  });
  document.querySelectorAll('h1,h2,h3,h4,p,li,a,button,td,th,label').forEach(el => {
    if (!visible(el) || isSkip(el)) return;
    const s = S(el);
    if (s.overflow !== 'visible' && s.textOverflow !== 'ellipsis' && el.scrollWidth > el.clientWidth + 1) issues.push(`clipped text: ${label(el)}`);
  });

  // 2. Header and nav
  const navSel = document.querySelector('header nav') ? 'header nav a' : 'nav a';
  const navLinks = [...document.querySelectorAll(navSel)].filter(a => visible(a) && !isSkip(a));
  if (navLinks.length > 1) {
    if (uniq(navLinks.map(a => Math.round(R(a).top))).length > 1) issues.push('nav links wrap onto more than one row');
    const gaps = navLinks.slice(1).map((a, i) => Math.round(R(a).left - R(navLinks[i]).right));
    if (Math.max(...gaps) - Math.min(...gaps) > 1) issues.push(`uneven gaps between nav links: ${gaps.join(', ')}`);
  }
  [...document.querySelectorAll('header button')].filter(b => /menu/i.test(b.textContent) && visible(b))
    .forEach(() => issues.push('mobile "Menu" toggle is visible on desktop'));
  const activeNav = navLinks.filter(a => a.getAttribute('aria-current') || /(^|\s)(active|is-active|current)(\s|$)/.test(a.className));
  if (activeNav.length !== 1) issues.push(`expected exactly 1 active nav item, found ${activeNav.length}`);
  const brand = header ? [...header.querySelectorAll('a')].filter(a => visible(a) && !isSkip(a))[0] : null;

  // 3. Headings
  const h1s = [...document.querySelectorAll('h1')].filter(visible);
  if (h1s.length !== 1) issues.push(`expected exactly 1 <h1>, found ${h1s.length}`);
  let prev = 0;
  [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(visible).forEach(h => {
    const level = Number(h.tagName[1]);
    if (prev && level > prev + 1) issues.push(`heading level skips from h${prev} to h${level}: "${h.textContent.trim().slice(0, 40)}"`);
    prev = level;
  });
  const separators = [];
  document.querySelectorAll('h1,h2,h3').forEach(h => {
    if (!visible(h)) return;
    const m = h.innerText.match(/\s(-|–|—)\s/);
    if (m) separators.push(m[1]);
  });

  // 4. Footer on short pages
  if (footer && doc.scrollHeight <= vh + 1 && R(footer).bottom < vh - 2) issues.push('footer floats above the bottom of the window on a short page');

  // 5. Fonts and typography lint
  const textEls = [...document.querySelectorAll('h1,h2,h3,h4,p,li,a,button,td,th,label,figcaption')].filter(el => visible(el) && !isSkip(el));
  const families = uniq(textEls.map(el => S(el).fontFamily.split(',')[0].replace(/["']/g, '').trim()));
  textEls.forEach(el => {
    const t = (el.innerText || '').trim();
    if (!t) return;
    if (/"|\w'\w/.test(t)) issues.push(`straight quote or apostrophe in: "${t.slice(0, 50)}"`);
  });
  document.querySelectorAll('main a[href], footer a[href]').forEach(a => {
    if (!visible(a)) return;
    const t = (a.innerText || '').trim();
    const href = a.getAttribute('href') || '';
    if (!t || /^(mailto|tel):/.test(href)) return;
    const url = new URL(a.href, location.href);
    const external = /^https?:$/.test(url.protocol) && url.host !== location.host && url.host.replace(/^www\./, '') !== prodHost;
    const pdf = url.pathname.endsWith('.pdf');
    const arrowNewTab = /↗$/.test(t);
    if ((external || pdf) && !arrowNewTab) issues.push(`external or PDF link without ↗: "${t.slice(0, 40)}"`);
    if (!external && !pdf && arrowNewTab) issues.push(`in-site link uses ↗: "${t.slice(0, 40)}"`);
    const n = a.nextSibling;
    if (n && n.nodeType === 3 && /^\s*[·•|]\s*$/.test(n.textContent)) issues.push(`typed "·" separator between links near "${t.slice(0, 30)}" (use a flex gap)`);
  });
  const ctaStyles = uniq([...root.querySelectorAll('a')]
    .filter(a => visible(a) && /[→↗↓]$/.test((a.innerText || '').trim()))
    .map(a => `${S(a).fontSize}/${S(a).fontWeight}`));
  if (ctaStyles.length > 1) issues.push(`more than one arrow-link style on this page: ${ctaStyles.join(', ')}`);

  // 6. Cards in the same row must match
  document.querySelectorAll('main *').forEach(parent => {
    const kids = [...parent.children].filter(k => visible(k) && hasBoundary(k));
    if (kids.length < 2) return;
    const rows = {};
    kids.forEach(k => { const key = Math.round(R(k).top / 4); (rows[key] ||= []).push(k); });
    Object.values(rows).forEach(row => {
      if (row.length < 2) return;
      const heights = row.map(k => Math.round(R(k).height));
      if (Math.max(...heights) - Math.min(...heights) > 1) issues.push(`cards in one row have different heights (${heights.join(', ')}) in ${label(parent)}`);
    });
  });

  // 7. Tables
  document.querySelectorAll('main table').forEach(t => {
    if (!visible(t)) return;
    const rows = [...t.rows].filter(visible);
    const ref = rows[0] ? [...rows[0].cells] : [];
    rows.slice(1).forEach(row => {
      const cells = [...row.cells];
      if (cells.length !== ref.length) return;
      cells.forEach((c, i) => {
        if (Math.abs(R(c).left - R(ref[i]).left) > 1 || Math.abs(R(c).width - R(ref[i]).width) > 1) issues.push(`table column ${i + 1} is misaligned in row ${row.rowIndex}`);
      });
    });
    for (let i = 0; i < ref.length; i++) {
      const aligns = uniq(rows.map(r => r.cells[i]).filter(Boolean).map(c => S(c).textAlign.replace('start', 'left').replace('end', 'right')));
      if (aligns.length > 1) issues.push(`table column ${i + 1} mixes text alignments: ${aligns.join(', ')}`);
    }
    let box = t.parentElement;
    while (box && box !== document.body && !hasBoundary(box)) box = box.parentElement;
    if (!box || box === document.body) {
      if (!hasBoundary(t)) issues.push('table is not inside a visibly bordered or filled box');
    } else {
      const b = R(box); const r = R(t);
      if (r.right > b.right + 1 || r.left < b.left - 1) issues.push('table sticks out of its box');
    }
  });

  // 8. Demo boxes
  [...document.querySelectorAll(demoSel)].filter(visible).forEach(box => {
    const b = R(box);
    if (!hasBoundary(box)) issues.push(`demo box has no visible boundary: ${label(box)}`);
    if (box.scrollWidth > box.clientWidth + 1) issues.push(`demo box overflows horizontally: ${label(box)}`);
    if (box.tagName === 'IFRAME') {
      try {
        const d = box.contentDocument;
        if (d && d.documentElement.scrollWidth > box.clientWidth + 1) issues.push('demo iframe content is wider than its frame');
      } catch (e) { /* cross-origin: skip */ }
    } else {
      const kids = [...box.children].filter(visible);
      const inset = Math.min(...kids.map(k => Math.min(R(k).left - b.left, b.right - R(k).right, R(k).top - b.top, b.bottom - R(k).bottom)));
      if (kids.length && inset < 12) issues.push(`content touches the demo box edge (inset ${Math.round(inset)}px): ${label(box)}`);
      const left = Math.min(...kids.map(k => R(k).left - b.left));
      const right = Math.min(...kids.map(k => b.right - R(k).right));
      if (kids.length && Math.abs(left - right) > 2) issues.push(`demo content is not centred in its box (left ${Math.round(left)}px, right ${Math.round(right)}px)`);
      box.querySelectorAll('*').forEach(c => {
        if (!visible(c) || S(c).position === 'fixed') return;
        const r = R(c);
        if (r.left < b.left - 1 || r.right > b.right + 1 || r.top < b.top - 1 || r.bottom > b.bottom + 1) issues.push(`outside the demo box: ${label(c)}`);
      });
    }
    if (h1s[0] && Math.abs(b.left - R(h1s[0]).left) > 2) issues.push(`demo box left edge (${Math.round(b.left)}px) differs from the page content edge (${Math.round(R(h1s[0]).left)}px)`);
  });

  // 9. Images
  document.querySelectorAll('img').forEach(img => {
    if (!visible(img)) return;
    if (!img.complete || img.naturalWidth === 0) { issues.push(`broken image: ${img.getAttribute('src')}`); return; }
    const natural = img.naturalWidth / img.naturalHeight;
    const shown = R(img).width / R(img).height;
    if (S(img).objectFit === 'fill' && Math.abs(natural - shown) / natural > 0.02) issues.push(`stretched image: ${img.getAttribute('src')}`);
    if (!img.getAttribute('alt') && img.getAttribute('alt') !== '') issues.push(`image missing alt: ${img.getAttribute('src')}`);
  });

  return {
    issues: uniq(issues).slice(0, 25),
    m: {
      headerH: header ? Math.round(R(header).height) : null,
      brandLeft: pos(brand),
      h1Left: pos(h1s[0]),
      h1Top: h1s[0] && header ? Math.round(R(h1s[0]).top - R(header).bottom) : null,
      footerLeft: footer ? pos([...footer.querySelectorAll('*')].find(e => visible(e) && e.children.length === 0) || footer) : null,
      headerText: header ? header.innerText.replace(/\s+/g, ' ').trim() : '',
      footerText: footer ? footer.innerText.replace(/\s+/g, ' ').trim() : '',
      navHrefs: navLinks.map(a => a.getAttribute('href')),
      activeNav: activeNav.map(a => a.textContent.trim()),
      families,
      separators,
      sizes: {
        nav: sizesIn(document, navSel),
        footer: footer ? sizesIn(document, 'footer') : [],
        h1: sizesIn(root, 'h1'),
        h2: sizesIn(root, 'h2'),
        h3: sizesIn(root, 'h3'),
        p: sizesIn(root, 'p'),
      },
    },
  };
}

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({channel: process.env.BROWSER_CHANNEL || "msedge"});
const siteRoutes = Object.values(GROUPS).flat();
const results = {};
const bucket = new Map(); // "route: message" -> viewports
const add = (vp, route, msg) => {
  const key = `${route}: ${msg}`;
  if (!bucket.has(key)) bucket.set(key, []);
  bucket.get(key).push(vp);
};

await Promise.all(VIEWPORTS.map(async vp => {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  results[vp.name] = {};
  for (const route of [...siteRoutes, ...DEMO_APP_PAGES]) {
    try {
      await page.goto(BASE + route, { waitUntil: 'networkidle' });
    } catch (e) {
      add(vp.name, route, `failed to load (${e.message.split('\n')[0]})`);
      continue;
    }
    await page.evaluate(() => (document.fonts ? document.fonts.ready : null));
    const slug = route.replace(/^\//, '').replace(/\W+/g, '_');
    await page.screenshot({ path: `${OUT}/${vp.name}__${slug}.png`, fullPage: true });
    if (DEMO_APP_PAGES.includes(route)) {
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      if (overflow) add(vp.name, route, 'demo app scrolls horizontally');
      continue;
    }
    const res = await page.evaluate(measure, { demoSel: DEMO_SELECTOR, prodHost: PROD_HOST });
    results[vp.name][route] = res;
    res.issues.forEach(msg => add(vp.name, route, msg));
    if (res.m.families.length > 2) add(vp.name, route, `more than 2 font families in use: ${res.m.families.join(', ')}`);
    const sz = res.m.sizes;
    if (sz.h2.length > 1) add(vp.name, route, `h2 uses more than one font size: ${sz.h2.join(', ')}`);
  }
  await page.close();
}));

// Cross-page consistency
const compare = (vpName, routes, get, what) => {
  const present = routes.filter(r => results[vpName][r]);
  if (present.length < 2) return;
  const ref = JSON.stringify(get(results[vpName][present[0]]));
  present.slice(1).forEach(r => {
    const val = JSON.stringify(get(results[vpName][r]));
    if (val !== ref) add(vpName, '(cross-page)', `${what} differs: ${present[0]} = ${ref} vs ${r} = ${val}`);
  });
};
for (const vp of VIEWPORTS) {
  [
    ['header height', d => d.m.headerH],
    ['brand left edge', d => d.m.brandLeft],
    ['header text', d => d.m.headerText],
    ['nav links', d => d.m.navHrefs],
    ['nav font size', d => d.m.sizes.nav],
    ['footer text', d => d.m.footerText],
    ['footer left edge', d => d.m.footerLeft],
    ['footer font size', d => d.m.sizes.footer],
    ['h1 left edge', d => d.m.h1Left],
  ].forEach(([what, get]) => compare(vp.name, siteRoutes, get, what));
  for (const [group, routes] of Object.entries(GROUPS)) {
    [
      ['h1 distance from header', d => d.m.h1Top],
      ['h1 font size', d => d.m.sizes.h1],
      ['h2 font size', d => d.m.sizes.h2],
      ['h3 font size', d => d.m.sizes.h3],
      ['body paragraph size', d => d.m.sizes.p],
    ].forEach(([what, get]) => compare(vp.name, routes, get, `${what} (${group} pages)`));
  }
}
const seps = {};
Object.entries(results[VIEWPORTS[0].name]).forEach(([route, d]) => d.m.separators.forEach(s => { (seps[s] ||= []).push(route); }));
if (Object.keys(seps).length > 1) {
  add('all', '(cross-page)', `heading separators are mixed: ${Object.entries(seps).map(([s, r]) => `"${s}" on ${uniqRoutes(r)}`).join(' | ')}`);
}
function uniqRoutes(r) { return [...new Set(r)].join(', '); }

fs.writeFileSync(`${OUT}/measurements.json`, JSON.stringify(results, null, 2));
await browser.close();
if (bucket.size) {
  console.log(`\nUI AUDIT FAILED (${bucket.size} issues). Screenshots are in ${OUT}/\n`);
  for (const [key, vps] of bucket) console.log(`- ${key}\n    at: ${vps.join(', ')}`);
  process.exit(1);
}
console.log(`\nUI AUDIT PASSED. Now open every screenshot in ${OUT}/ and check it by eye.`);


