import test from 'node:test';
import assert from 'node:assert/strict';
import { render, slugs } from '../src/pages.js';

const opts = [[], {}, {}, true, ''];
test('all public pages render HTML with metadata and preview noindex', () => {
  const titles = new Set();
  for (const slug of slugs) {
    const html = render(slug, ...opts);
    assert.ok(html, slug + ' rendered');
    assert.match(html, /<!doctype html>/i);
    assert.match(html, /<meta name="robots" content="noindex,nofollow,noarchive"/);
    assert.match(html, /<link rel="canonical"/);
    assert.match(html, /<script type="application\/ld\+json">/);
    if (slug !== '/') assert.match(html, /aria-label="Breadcrumb"/);
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    assert.ok(title && !titles.has(title), 'Unique title: ' + slug);
    titles.add(title);
    const schema = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1];
    assert.ok(JSON.parse(schema)['@graph'].length >= 4);
  }
});
test('production output is crawlable and canonicalised to the live domain', () => {
  const html = render('/', [], {}, {}, false, '');
  assert.match(html, /name="robots" content="index,follow,max-image-preview:large"/);
  assert.match(html, /href="https:\/\/kitchensprayexpert\.co\.uk\/"/);
});
test('contact page provides genuine server-side form destination', () => {
  const html = render('/contact/', [], {}, {}, true, '');
  assert.match(html, /method="post" action="\/contact\/"/);
  assert.match(html, /name="consent"/);
  assert.match(html, /name="email"/);
});
test('image metadata is safely escaped', () => {
  const html = render('/gallery/', [{id:'x',file:'abc.webp',alt:'<script>alert("hi")</script>',featured:false,createdAt:new Date().toISOString()}], {}, {}, true, '');
  assert.ok(!html.includes('<script>alert("hi")</script>'));
  assert.match(html, /&lt;script&gt;/);
});

test('navigation offers descriptive links and independently aligned arrow controls', () => {
  const html = render('/', ...opts);
  assert.match(html, /data-nav-group/);
  assert.match(html, /id="nav-services"/);
  assert.match(html, /id="nav-locations"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /Kitchen spraying Ayrshire/);
  assert.match(html, /An expert makeover for existing cabinetry/);
  assert.match(html, /class="link-arrow-icon"/);
  assert.doesNotMatch(html, /class="brand-mark"/);
  assert.doesNotMatch(html, /KSE\./);
});
test('header and footer accept independently uploaded branding, including business logo schema', () => {
  const html = render('/', [], {}, {headerLogoFile:'logo-abc123.webp',footerLogoFile:'logo-def456.webp'}, false, '');
  assert.match(html, /src="\/media\/logo-abc123\.webp"/);
  assert.match(html, /src="\/media\/logo-def456\.webp"/);
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1]);
  const business = schema['@graph'].find(item => item['@type'] === 'HomeAndConstructionBusiness');
  assert.equal(business.logo.url, 'https://kitchensprayexpert.co.uk/media/logo-abc123.webp');
});
test('interior pages use kitchen photography and retain clear hero copy', () => {
  const galleryPhoto={id:'1',file:'test.webp',alt:'Freshly resprayed kitchen cabinet',category:'project',createdAt:'2026-10-18'};
  for (const slug of slugs.filter(slug => slug !== '/')) {
    const html = render(slug, [galleryPhoto], {}, {}, true, '');
    assert.match(html, /class="page-banner-visual"/);
    assert.match(html, /src="\/media\/test\.webp"/);
    assert.match(html, /class="page-banner-actions"/);
  }
  assert.match(render('/contact/', [], {}, {}, true,''), /id="quote-form"/);
});


test('finishing touches are easy to find and are separately quoted', () => {
  const home=render('/', ...opts);
  assert.match(home, /Complete the look/);
  assert.match(home, /Handles &amp; hardware/);
  assert.match(home, /Worktops/);
  assert.match(home, /Sinks &amp; taps/);
  assert.match(home, /\/kitchen-upgrades\//);
  assert.match(render('/kitchen-spraying/', ...opts), /finishing-touches/);
  assert.match(render('/kitchen-respray-cost/', ...opts), /not included in the published spraying guide prices/);
});
test('finishing touches landing page has individual quote links and metadata', () => {
  const html=render('/kitchen-upgrades/', ...opts);
  assert.match(html, /Optional Kitchen Upgrades &amp; Finishing Touches/);
  assert.match(html, /interest=handles#quote-form/);
  assert.match(html, /interest=worktops#quote-form/);
  assert.match(html, /interest=sinks-taps#quote-form/);
});
test('optional extras are selectable in enquiry form', () => {
  const h=render('/contact/', [], {interest:'worktops'}, {}, true, '');
  assert.match(h, /name="upgrades" value="worktops" checked/);
  assert.match(h, /name="upgrades" value="handles"/);
  assert.match(h, /name="upgrades" value="sinks-taps"/);
});
