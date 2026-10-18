import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { load } from 'cheerio';
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


test('RAL chart has clickable colour families, shade codes and caveats', () => {
  const html=render('/ral-colours/', [], {}, {}, true, '');
  assert.match(html,/data-ral-board/);
  assert.match(html,/data-ral-shade="RAL 6011"/);
  assert.match(html,/data-ral-shade="RAL 3005"/);
  assert.match(html,/data-ral-filter="Neutrals"/);
  assert.match(html,/approximate digital/);
  assert.match(html,/RAL gGmbH/);
});
test('RAL colour inspiration appears on home and core service pages', () => {
  for(const slug of ['/','/kitchen-spraying/','/kitchen-cabinet-spraying/','/kitchen-door-spraying/']){
    const html=render(slug,[],{}, {},true,'');
    assert.match(html,/data-ral-board/);
    assert.match(html,/\/ral-colours\//);
  }
});
test('quote form supports prefilled RAL code and large optional extras tiles', () => {
  const html=render('/contact/',[],{ral:'RAL 6011',interest:'handles'}, {},true,'');
  assert.match(html,/name="ralColour" maxlength="40"[^>]*value="RAL 6011"/);
  assert.match(html,/class="finishing-choice-tile"/);
  assert.match(html,/name="upgrades" value="handles" checked/);
  assert.match(html,/name="upgrades" value="worktops"/);
  assert.match(html,/class="tile-check"/);
});
test('dropdown links do not have redundant icons, only top-level chevrons', () => {
  const html=render('/', ...opts);
  const links=html.match(/<a class="dropdown-card"[^>]*>[\s\S]*?<\/a>/g)||[];
  assert.ok(links.length>=5);
  for(const link of links)assert.doesNotMatch(link,/link-arrow-icon/);
  assert.match(html,/class="nav-chevron"/);
  assert.match(html,/An expert makeover for existing cabinetry/);
});
test('hero uses a crisp photo beside copy rather than an overlay', () => {
  const html=render('/', ...opts);
  assert.match(html,/class="hero editorial-hero"/);
  assert.match(html,/class="hero-copy"/);
  assert.doesNotMatch(html,/class="hero-overlay"/);
});


test('home hero remains in a solid text panel, with guarded desktop and laptop CSS breakpoints', () => {
  const styles = fs.readFileSync(new URL('../public/site.css', import.meta.url), 'utf8');
  assert.equal((styles.match(/@import url\(/g) || []).length, 1,
    'Duplicated base stylesheet must not reappear');
  assert.match(styles, /@media\(min-width:1101px\)\s*\{[\s\S]*?\.editorial-hero \.hero-content\s*\{\s*display:flex;\s*flex-direction:row;/);
  assert.match(styles, /@media\(max-width:1100px\)\s*\{[\s\S]*?\.hero\.editorial-hero\s*\{\s*display:flex;\s*flex-direction:column;/);
  assert.match(styles, /\.editorial-hero \.hero-copy\s*\{[\s\S]*?flex:0 0 47%;\s*width:47%;/);
  assert.match(render('/', ...opts), /class="hero-copy"/);
});


test('finishing touch tiles are valid HTML with exactly three independent clickable choices', () => {
  const html=render('/contact/', [], {interest:'handles'}, {}, true, '');
  assert.match(html, /<div class="finishing-choices">/);
  assert.doesNotMatch(html, /<div class="finishing-choices>/);
  const $=load(html);
  const grid=$('.quote-form section.finishing-fieldset .finishing-choices');
  assert.equal(grid.length, 1, 'One valid finishing-touches grid');
  const tiles=grid.children('label.finishing-choice-tile');
  assert.equal(tiles.length, 3, 'All tiles are direct children of the grid');
  const expected=['handles','worktops','sinks-taps'];
  tiles.each((index, element) => {
    const tile=$(element);
    assert.equal(tile.children('input[type="checkbox"][name="upgrades"]').val(), expected[index]);
    assert.equal(tile.children('.tile-check').length, 1);
    assert.equal(tile.children('.tile-words').length, 1);
    assert.ok(tile.find('.tile-words strong').text().trim());
    assert.ok(tile.find('.tile-words small').text().trim());
  });
  assert.notEqual(tiles.first().children('input').attr('checked'), undefined);
});


test('business structured data links the verified Clydebank Google Business Profile', () => {
  const expected='ChIJR2WVf9NPiEgRr7OCATM9DlI';
  for (const pathname of ['/', '/about/', '/contact/']) {
    const html=render(pathname, ...opts);
    const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1])['@graph'];
    const business=graph.find(x=>x['@type']==='HomeAndConstructionBusiness');
    assert.ok(business, 'Business schema is present for '+pathname);
    assert.ok(business.sameAs.some(x=>x.includes('query_place_id='+expected)), 'Exact Google Place ID is in sameAs');
    assert.equal(business.hasMap, business.sameAs[0]);
    assert.equal(business.address.postalCode, 'G81 2QP');
  }
});
test('RAL field includes digital swatch preview and current colour is prefilled', () => {
  const html=render('/contact/', [], {ral:'RAL 3011'}, {}, true, '');
  const $=load(html);
  const field=$('.quote-form .ral-form-field');
  assert.equal(field.length, 1);
  assert.equal(field.find('input[name="ralColour"]').val(), 'RAL 3011');
  assert.equal(field.find('[data-ral-form-paint]').attr('style'), 'background-color:#853C3C');
  assert.equal(field.find('[data-ral-form-name]').text(), 'Brown red');
  assert.equal(field.find('option[data-ral-swatch]').length, 18);
  assert.match(field.find('.ral-form-hint').text(), /physical colour sample/);
});
test('optional extras fieldset explanation stays concise and markup intact', () => {
  const html=render('/contact/', [], {}, {}, true, '');
  const $=load(html);
  assert.equal($('.quote-form .finishing-fieldset > p').text(), 'Select any extras to discuss. Quoted separately.');
  assert.equal($('.quote-form .finishing-choices > label.finishing-choice-tile').length, 3);
});


test('extras heading and note are inside a labelled container', () => {
  const $=load(render('/contact/', [], {}, {}, true, ''));
  const group=$('.quote-form section.finishing-fieldset');
  assert.equal(group.length,1);
  assert.equal(group.attr('aria-labelledby'),'finishing-title');
  assert.equal(group.children('.finishing-heading').find('#finishing-title').text(),'Interested in any finishing touches?');
  assert.equal(group.children('.finishing-intro').text(),'Select any extras to discuss. Quoted separately.');
  assert.equal(group.children('.finishing-choices').children('label.finishing-choice-tile').length,3);
});
test('RAL paint preview shows a solid chosen colour instead of the checkerboard image', () => {
  const styles=fs.readFileSync(new URL('../public/site.css', import.meta.url), 'utf8');
  assert.match(styles,/\.ral-form-paint\.has-shade\s*\{\s*background-image:none;/);
  const $=load(render('/contact/', [], {ral:'RAL 7032'}, {}, true, ''));
  const paint=$('[data-ral-form-paint]');
  assert.equal(paint.hasClass('has-shade'),true);
  assert.equal(paint.attr('style'),'background-color:#B2B3A5');
  assert.equal($('[data-ral-form-name]').text(),'Pebble grey');
});


test('local service landing pages use clear geographic H1s and matching LocalBusiness NAP', () => {
  for (const area of ['Glasgow','Ayrshire','Lanarkshire','Edinburgh','Stirling']) {
    const slug='/kitchen-spraying-'+area.toLowerCase()+'/';
    const html=render(slug, ...opts);
    const $=load(html);
    assert.equal($('h1').length,1);
    assert.equal($('h1').text(), 'Kitchen spraying in '+area);
  }
  for (const slug of ['/','/about/','/contact/']) {
    const html=render(slug, ...opts);
    assert.match(html,/14 North Avenue/);
    assert.match(html,/G81 2QP/);
    const data=JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1]);
    const business=data['@graph'].find(v=>v['@type']==='HomeAndConstructionBusiness');
    assert.equal(business.address.postalCode, 'G81 2QP');
    assert.match(business.address.streetAddress,/14 North Avenue/);
  }
});
