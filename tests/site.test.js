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
