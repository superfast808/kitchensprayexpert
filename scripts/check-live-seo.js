import { load } from 'cheerio';

const origin = (process.argv[2] || process.env.PUBLIC_SITE_URL || 'https://kitchensprayexpert.co.uk').replace(/\/+$/, '');
const paths = ['/', '/kitchen-spraying/', '/kitchen-cabinet-spraying/', '/kitchen-door-spraying/', '/kitchen-spraying-glasgow/'];
let failures = 0;

async function request(path) {
  const url = origin + path;
  const response = await fetch(url, {
    redirect: 'follow',
    headers: { 'User-Agent': 'KitchenSprayingExpertSEOCheck/1.0' },
    signal: AbortSignal.timeout(12000)
  });
  if (!response.ok) throw new Error(url + ' returned HTTP ' + response.status);
  return { response, text: await response.text() };
}

function problem(message) {
  failures += 1;
  console.error('FAIL', message);
}
function ok(message) { console.log('OK  ', message); }

for (const path of paths) {
  try {
    const { response, text } = await request(path);
    const $ = load(text);
    const header = response.headers.get('x-robots-tag') || '';
    const robots = $('meta[name="robots"]').attr('content') || '';
    const canonical = $('link[rel="canonical"]').attr('href');
    const mainH1 = $('main h1');
    if (/noindex|nofollow/i.test(header + ' ' + robots)) problem(path + ' is blocked by robots directives: ' + [header, robots].filter(Boolean).join(' / '));
    else ok(path + ' has no noindex or nofollow directive');
    if ($('h1').length !== 1 || mainH1.length !== 1) problem(path + ' must have exactly one H1 in <main>');
    else ok(path + ' H1: ' + mainH1.text().trim());
    if (canonical !== origin + path) problem(path + ' canonical mismatch: ' + canonical);
  } catch (error) {
    problem(path + ' could not be checked: ' + error.message);
  }
}
try {
  const { text } = await request('/robots.txt');
  if (/^\s*Disallow:\s*\/\s*$/im.test(text)) problem('/robots.txt blocks all crawling');
  else if (!/Sitemap:/i.test(text)) problem('/robots.txt is missing a sitemap directive');
  else ok('/robots.txt permits crawling and advertises a sitemap');
} catch (error) {
  problem('/robots.txt could not be checked: ' + error.message);
}
try {
  const { text } = await request('/sitemap.xml');
  if (!text.includes('<urlset') || !text.includes('<loc>' + origin + '/</loc>')) problem('/sitemap.xml is missing expected page URLs');
  else ok('/sitemap.xml includes the homepage');
} catch (error) {
  problem('/sitemap.xml could not be checked: ' + error.message);
}
if (failures) {
  console.error('SEO smoke check failed with ' + failures + ' issue(s). Confirm PREVIEW_MODE=false on production.');
  process.exitCode = 1;
} else {
  console.log('SEO smoke check passed for ' + origin);
}
