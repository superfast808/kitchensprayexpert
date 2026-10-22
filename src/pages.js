const BASE = (process.env.PUBLIC_SITE_URL || 'https://kitchensprayexpert.co.uk').replace(/\/+$/, '');
const PHONE = '07764 603423';
const TEL = '+447764603423';
const FALLBACK_HERO = 'https://kitchensprayexpert.co.uk/images/1024/15289468/sleek-modern-kitchen-interior-in-cape-town-showcasing-contemporary-design-elements-c1I7wboltiN_PJVtAgPZ2A.jpeg';
const FALLBACK_DETAIL = 'https://kitchensprayexpert.co.uk/images/768/15289391/WhatsApp-Image-2022-12-18-at-15.30.04-1-768x1024-IXxPqWCkx62nv-QuGVNiYQ.jpeg';
const areas = [
  { slug: 'glasgow', name: 'Glasgow', subtitle: 'A beautiful new kitchen look, without a full replacement.', intro: 'From West End tenements to Southside family homes, we help Glasgow homeowners transform sound existing cabinetry with a professional spray finish.', notes: 'Our Clydebank spray centre makes Glasgow an ideal area for carefully managed collection, finishing and refitting.' },
  { slug: 'ayrshire', name: 'Ayrshire', subtitle: 'Kitchen makeovers for homes across Ayrshire.', intro: 'Whether you are in Kilmarnock, Ayr, Irvine or the surrounding towns, a kitchen respray can make tired doors and drawers feel fresh again without replacing every unit.', notes: 'We arrange an initial assessment, discuss your colour choices and confirm the scope of the work before starting.' },
  { slug: 'lanarkshire', name: 'Lanarkshire', subtitle: 'A smarter alternative to new kitchen units.', intro: 'We serve homeowners across Lanarkshire, including East Kilbride, Hamilton and nearby communities, offering kitchen cabinet refinishing and colour changes.', notes: 'Doors and drawer fronts are carefully removed for specialist preparation and spraying, then returned for refitting.' },
  { slug: 'edinburgh', name: 'Edinburgh', subtitle: 'Give your existing kitchen a fresh direction.', intro: 'For Edinburgh homeowners with a kitchen layout they already love, professional cabinet respraying offers a way to modernise finishes while keeping serviceable units.', notes: 'Contact the team with your postcode and kitchen photos to check availability and obtain a tailored quotation.' },
  { slug: 'stirling', name: 'Stirling', subtitle: 'Precision kitchen spraying for a refined finish.', intro: 'Homeowners in Stirling and the surrounding area can refresh cabinet doors, plinths and drawer fronts with a durable, carefully prepared spray finish.', notes: 'Choose from a wide range of colours and ask about handles, worktops and other available upgrades.' }
];
export const slugs = ['/', '/kitchen-spraying/', '/kitchen-cabinet-spraying/', '/kitchen-door-spraying/', '/kitchen-respray-cost/', '/how-it-works/', '/kitchen-upgrades/', '/ral-colours/', '/gallery/', '/about/', '/contact/', '/privacy/', ...areas.map(a => '/kitchen-spraying-' + a.slug + '/')];
const faqs = [
  ['Is kitchen spraying cheaper than replacing a kitchen?', 'It can be substantially more affordable when your existing cabinet units are in good condition. The price depends on the number of doors, drawers, surfaces and any optional upgrades.'],
  ['Do you spray cabinet doors in my home?', 'Removable doors, drawer fronts and related components are taken to our specialist spray facility near Glasgow, where they are prepared, sprayed and checked before refitting. We will explain any on-site work at quotation stage.'],
  ['Can I choose any colour?', 'There is a broad range of colours and finishes. We can discuss suitable colour matches and the finish that works best for your cabinetry.'],
  ['Is there a guarantee?', 'Kitchen Spraying Expert advertises a two-year workmanship guarantee. Ask for the written terms with your quotation.'],
  ['Can you replace handles or worktops too?', 'Optional upgrades can include worktops, handles, sinks and taps in conjunction with a kitchen respray. Availability and pricing are confirmed during your consultation.'],
  ['Which areas do you cover?', 'Based in Clydebank, we cover Glasgow, Ayrshire, Lanarkshire, Stirling, Edinburgh and other locations across central and south-west Scotland. Ask us about your postcode.']
];
const pageData = {
  '/': ['Kitchen Spraying Glasgow & Scotland | Kitchen Spraying Expert','Professional kitchen spraying and cabinet resprays across Glasgow, Ayrshire and central Scotland. Explore finishes, transparent starting prices and request a free quote.'],
  '/kitchen-spraying/': ['Kitchen Spraying Services in Scotland | Kitchen Spraying Expert','Transform your existing kitchen with specialist spray finishes, careful preparation and a two-year workmanship guarantee.'],
  '/kitchen-cabinet-spraying/': ['Kitchen Cabinet Spraying Scotland | Kitchen Spraying Expert','Professional cabinet refinishing across Glasgow and central Scotland. Explore the preparation and spray process and request a quote.'],
  '/kitchen-door-spraying/': ['Kitchen Door Spraying Glasgow & Scotland | Kitchen Spraying Expert','Refresh your kitchen doors and drawer fronts with specialist off-site spraying and professional refitting.'],
  '/kitchen-respray-cost/': ['Kitchen Respray Cost Scotland | Prices & Quote','How much does a kitchen respray cost in Scotland? See published starting prices for small, medium and large kitchens and what affects your quote.'],
  '/how-it-works/': ['How Kitchen Spraying Works | Our Process','See the four-stage kitchen spraying process, from consultation and removal to professional spray finishing and refitting.'],
  '/kitchen-upgrades/': ['Optional Kitchen Upgrades & Finishing Touches | Kitchen Spraying Expert','Explore optional handles, worktops, sinks and taps alongside your kitchen respray in Glasgow and central Scotland.'],
  '/ral-colours/': ['RAL Kitchen Spray Colours | Kitchen Spraying Expert','Browse kitchen spraying colour inspiration across RAL Classic greens, creams, greys and blues. Ask about a physical sample.'],
  '/gallery/': ['Kitchen Spraying Gallery | Finishes & Inspiration','Explore kitchen finishes, colour inspiration and pictures from Kitchen Spraying Expert.'],
  '/about/': ['About Kitchen Spraying Expert | Clydebank, Glasgow','Find out about Kitchen Spraying Expert, the Clydebank spray facility and our approach to beautifully finished kitchen cabinets.'],
  '/contact/': ['Free Kitchen Spraying Quote | Contact Us','Contact Kitchen Spraying Expert for a no-obligation kitchen spraying quote in Glasgow, Ayrshire, Lanarkshire and across central Scotland.'],
  '/privacy/': ['Privacy Notice | Kitchen Spraying Expert','How Kitchen Spraying Expert handles enquiry details and contact information.']
};
const areaMeta = {
  glasgow: "Professional kitchen spraying in Glasgow, with doors and cabinets refinished at our Clydebank-area spray facility. Request a tailored quote.",
  ayrshire: "Kitchen spraying across Ayrshire, including Ayr, Kilmarnock and Irvine. Refresh cabinet doors and drawer fronts and request a tailored quote.",
  lanarkshire: "Kitchen cabinet spraying across Lanarkshire, including East Kilbride and Hamilton. Discuss door finishes, panels and refitting.",
  edinburgh: "Explore kitchen door and cabinet spraying in Edinburgh. Check service availability, suitable finishes and quotation options.",
  stirling: "Kitchen spraying in Stirling and surrounding areas. Discover cabinet refinishing, colour choices and tailored quotations."
};
for (const a of areas) pageData['/kitchen-spraying-' + a.slug + '/'] = ['Kitchen Spraying ' + a.name + ' | Kitchen Spraying Expert', areaMeta[a.slug]];

function e(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function textImage(m) { return m ? '/media/' + encodeURIComponent(m.file) : FALLBACK_HERO; }
function crumb(path, label) {
  if (path === '/') return '';
  return '<nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>' + e(label) + '</span></nav>';
}
function btn(label, link, secondary) { return '<a class="btn ' + (secondary ? 'btn-outline' : 'btn-primary') + '" href="' + e(link) + '">' + e(label) + '<span aria-hidden="true">↗</span></a>'; }
function interiorImage(media, index=0) {
  const preferred = media.filter(x => x.category === 'project' || x.category === 'after');
  const images = preferred.length ? preferred : media;
  if (!images.length) return index%2 ? FALLBACK_DETAIL : FALLBACK_HERO;
  return '/media/' + encodeURIComponent(images[Math.abs(index) % images.length].file);
}
function banner(kicker, title, intro, img = FALLBACK_HERO, label) {
  return '<section class="page-banner"><div class="page-banner-visual"><img src="' + e(img || FALLBACK_HERO) +
    '" alt="' + e(label || 'Freshly styled kitchen cabinetry') +
    '"></div><div class="wrap page-banner-inner"><div class="page-banner-copy">' +
    '<span class="eyebrow">' + e(kicker) + '</span><h1>' + e(title) + '</h1><p>' + e(intro) +
    '</p><div class="page-banner-actions">' +
    (kicker === 'Let us talk kitchens' ? btn('Complete the enquiry form','#quote-form') : btn('Get a free quote','/contact/')) +
    '<a class="text-link" href="' + (kicker === 'The lookbook' ? '/kitchen-respray-cost/' : kicker === 'Privacy' ? '/contact/' : '/gallery/') + '">' +
    (kicker === 'The lookbook' ? 'Explore guide prices' : kicker === 'Privacy' ? 'Contact us' : 'Explore our finishes') +
    ' <span aria-hidden="true">↗</span></a></div>' +
    '</div></div><div class="page-banner-caption"><span class="caption-line"></span> REFRESH WHAT YOU ALREADY LOVE</div></section>';
}
function sectionHead(k,t,d) { return '<div class="section-heading"><span class="eyebrow">' + e(k) + '</span><h2>' + e(t) + '</h2>' + (d ? '<p>' + e(d) + '</p>' : '') + '</div>'; }

const extras = [
 ['handles','Handles & hardware','Fresh handles can transform newly sprayed cabinets.','Discuss modern pulls, subtle knobs and coordinated finishes.'],
 ['worktops','Worktops','A new surface can pull the whole colour scheme together.','Ask about options where suitable for your existing kitchen.'],
 ['sinks-taps','Sinks & taps','Consider the final details for a beautifully coordinated finish.','Explore possible upgrades alongside the kitchen spraying quotation.']
];
function finishingTouches(pale=false) {
 return '<section class="section finishing-touches '+(pale?'soft-section':'')+'"><div class="wrap"><div class="finishing-head"><div><span class="eyebrow">Optional extras · Finishing touches</span><h2>Complete the look.</h2><p>Kitchen spraying is the starting point. Handles, worktops, sinks and taps can complement freshly finished cabinets.</p></div>'+btn('Explore finishing touches','/kitchen-upgrades/',true)+'</div><div class="finishing-grid">'+extras.map((x,i)=>'<article class="finishing-card"><span class="finishing-number">0'+(i+1)+'</span><h3>'+e(x[1])+'</h3><p>'+e(x[2])+'</p><p class="finishing-detail">'+e(x[3])+'</p><a href="/contact/?interest='+x[0]+'#quote-form">Ask about '+e(x[1].toLowerCase())+' <span aria-hidden="true">↗</span></a></article>').join('')+'</div><p class="finishing-small">Optional extras are quoted separately, subject to suitability, availability and agreed installation arrangements. They are not included in the published spraying guide prices.</p></div></section>';
}
function upgradesPage(media) {
 return banner('Finishing touches','The details make the difference','Consider handles, worktops, sinks and taps alongside a professional kitchen respray.',interiorImage(media,2))+
 '<section class="section"><div class="wrap split align-centre"><div>'+sectionHead('A coordinated kitchen','Bring the whole look together','Cabinet spraying sets the direction. The finer details make it your own.')+
 '<p>Beautifully sprayed doors may look even better with updated hardware or complementary surfaces. We can discuss optional improvements alongside the main kitchen spraying quotation.</p><p>Each extra is quoted individually and subject to suitability, availability and confirmed supply or fitting arrangements.</p>'+
 btn('Discuss my options','/contact/?interest=all#quote-form')+'</div><div class="feature-panel"><span class="eyebrow">Worth considering</span><ul class="check-list"><li>Cabinet handle style and finish</li><li>Worktop condition and colour</li><li>Sink and tap coordination</li><li>Separately agreed pricing</li></ul></div></div></section>'+finishingTouches(true)+cta();
}


const colourReferences = [["RAL 9010","Pure white","#F0EEE6","Neutrals"],["RAL 9001","Cream","#E4D5B7","Neutrals"],["RAL 1013","Oyster white","#E5DFC8","Neutrals"],["RAL 1019","Grey beige","#A99D86","Neutrals"],["RAL 7032","Pebble grey","#B2B3A5","Neutrals"],["RAL 7044","Silk grey","#C7C7BB","Neutrals"],["RAL 7016","Anthracite grey","#343F45","Neutrals"],["RAL 7039","Quartz grey","#6B6C62","Neutrals"],["RAL 6021","Pale green","#8DA588","Greens"],["RAL 6011","Reseda green","#637F62","Greens"],["RAL 6003","Olive green","#505640","Greens"],["RAL 6005","Moss green","#294636","Greens"],["RAL 5014","Pigeon blue","#647C95","Blues"],["RAL 5008","Grey blue","#313E4B","Blues"],["RAL 5011","Steel blue","#273746","Blues"],["RAL 3005","Wine red","#5B2935","Statement"],["RAL 3011","Brown red","#853C3C","Statement"],["RAL 4004","Claret violet","#533447","Statement"]];
function ralBoard(full=false) {
  const options=full?colourReferences:colourReferences.filter((c,i)=>[0,3,6,8,9,11,12,15].includes(i));
  const first=options[0];
  return '<div class="ral-board" data-ral-board style="--ral-preview:'+first[2]+'">'+
   (full?'<div class="ral-filter-row" role="group" aria-label="Filter colour families">'+['All colours','Neutrals','Greens','Blues','Statement'].map((family,i)=>
    '<button type="button" class="ral-filter" data-ral-filter="'+e(family)+'" aria-pressed="'+(i===0?'true':'false')+'">'+e(family)+'</button>').join('')+'</div>':'')+
   '<div class="ral-board-layout"><div class="ral-grid" role="group" aria-label="RAL Classic colour references">'+options.map((c,i)=>
    '<button type="button" class="ral-chip" data-ral-shade="'+e(c[0])+'" data-ral-name="'+e(c[1])+'" data-ral-colour="'+c[2]+'" data-ral-group="'+e(c[3])+'" aria-pressed="'+(i===0?'true':'false')+'">'+
    '<span class="ral-chip-paint" style="background:'+c[2]+'"></span><strong>'+e(c[0])+'</strong><small>'+e(c[1])+'</small></button>').join('')+'</div>'+
   '<aside class="ral-sample"><span class="eyebrow">Your colour moodboard</span><h3 data-ral-code>'+first[0]+'</h3><p data-ral-name>'+first[1]+'</p>'+
   '<div class="ral-cabinets" aria-label="Illustrative kitchen cabinet finish preview"><span></span><span></span><span></span></div>'+
   '<p>Digital colours are indicative, not official colour standards. Confirm shade and sheen using a physical sample.</p>'+
   '<a class="btn btn-primary" data-ral-link href="/contact/?ral='+encodeURIComponent(first[0])+'#quote-form">Discuss this colour <span aria-hidden="true">↗</span></a></aside></div></div>';
}
function ralSection(full=false) {
 return '<section class="section ral-showcase '+(full?'':'soft-section')+'"><div class="wrap"><div class="ral-heading"><div><span class="eyebrow">Colour inspiration · RAL Classic references</span><h2>'+(full?'Find a shade that feels like you.':'Colour changes everything.')+'</h2>'+
 '<p>From calming neutrals and classic greens to bold blues and rich wine tones, explore colour references to discuss as part of your kitchen makeover.</p></div>'+
 (full?'':btn('Explore the full colour chart','/ral-colours/',true))+'</div>'+ralBoard(full)+
 '<p class="ral-caution">Swatches are approximate digital illustrations, not official RAL standards or guarantees of shade availability. Screen settings, lighting, substrate and sheen affect appearance. Agree a physical colour sample before final confirmation. RAL is a trademark of RAL gGmbH.</p></div></section>';
}
function ralPage(media) {
 return banner('Kitchen colour inspiration','Your kitchen. Your colour.','Explore carefully chosen RAL Classic references for your kitchen respray.',interiorImage(media,4))+
 ralSection(true)+
 '<section class="section"><div class="wrap split"><div>'+sectionHead('Choosing your colour','The right shade, the right finish.','The same colour can look different under different lighting and finishes.')+
 '<p>Our swatches are for inspiration. The team will help you discuss suitable colours and finishes for your existing doors and cabinetry. A physical colour sample should be checked before your final decision.</p>'+
 btn('Talk colour with us','/contact/#quote-form')+'</div><div class="feature-panel"><span class="eyebrow">Good colour decisions</span><ul class="check-list"><li>View physical samples in your kitchen lighting</li><li>Consider available finish and sheen choices</li><li>Compare with worktops and handles</li><li>Confirm suitable spraying materials and colour options</li></ul></div></div></section>'+cta();
}

function faqHtml() { return '<section class="section faq-section"><div class="wrap split"><div>' + sectionHead('Good to know','Your questions, answered','A few useful things to know before planning your kitchen makeover.') + btn('Ask us something', '/contact/', true) + '</div><div class="faq-list">' + faqs.map((x,i) => '<details ' + (i===0?'open':'') + '><summary>' + e(x[0]) + '<span>+</span></summary><p>' + e(x[1]) + '</p></details>').join('') + '</div></div></section>'; }
function cta() { return '<section class="cta-band"><div class="wrap cta-inner"><div><span class="eyebrow">Your next chapter starts here</span><h2>Love your kitchen again.</h2><p>Tell us about your kitchen, the finish you have in mind and where you are based. We will take it from there.</p></div>' + btn('Get my free quote','/contact/') + '</div></section>'; }
function photoGrid(media, limit=6) {
  const items = media.slice(0,limit);
  if (!items.length) return '<div class="gallery-empty"><img class="gallery-empty-image" loading="lazy" src="'+FALLBACK_DETAIL+'" alt="Kitchen cabinet finish inspiration"><div><h3>Great transformations are worth showing.</h3><p>Our refreshed image gallery is coming together. Ask the team about colours, finishes and examples of their work.</p></div></div>';
  return '<div class="photo-grid">' + items.map((m,i) => '<figure class="photo-tile ' + (i===0 ? 'photo-large':'') + '"><img loading="lazy" src="/media/' + encodeURIComponent(m.file) + '" alt="' + e(m.alt || 'Kitchen finish and colour inspiration') + '"><figcaption>' + e(m.alt || 'Kitchen finish inspiration') + '</figcaption></figure>').join('') + '</div>';
}
function why() { const points=[['01','A considered alternative','Keep the cabinetry that works and change the look instead of starting from scratch.'],['02','Carefully prepared','Doors and drawer fronts are removed, prepared and sprayed at our specialist facility.'],['03','Colour without compromise','Explore classic neutrals, bold statement shades and finishes to suit your space.'],['04','A finish you can trust','A two-year workmanship guarantee is offered, with written terms provided for each job.']]; return '<section class="section dark-section"><div class="wrap">' + sectionHead('Why respray?','A big change. A simpler process.','Thoughtful craftsmanship for kitchens that deserve a second life.') + '<div class="benefits">' + points.map(p=>'<article><span class="benefit-index">'+p[0]+'</span><h3>'+p[1]+'</h3><p>'+p[2]+'</p></article>').join('') + '</div></div></section>'; }
function steps() { const items=[['1','Tell us your plans','Send a few photographs, choose a general colour direction and receive a tailored quotation.'],['2','Careful removal','We remove suitable doors, drawer fronts and trim with care and transport them to the spray facility.'],['3','Professional finish','Every piece is prepared, sprayed and quality-checked to achieve an even, durable result.'],['4','Reinstallation & reveal','We return and refit everything, ready for you to enjoy the transformed kitchen.']]; return '<div class="steps">' + items.map(p=>'<article><span>'+p[0]+'</span><div><h3>'+p[1]+'</h3><p>'+p[2]+'</p></div></article>').join('') + '</div>'; }
function priceCards() { const ps=[['Small kitchen','Up to 6 doors & 5 drawers','£1,300'],['Medium kitchen','Up to 16 doors & 8 drawers','£1,950'],['Large kitchen','Up to 25 doors & 10 drawers','£2,350']]; return '<div class="price-grid">' + ps.map((p,i)=>'<article class="price-card ' + (i===1?'recommended':'') + '"><span class="eyebrow">'+p[0]+'</span><p>'+p[1]+'</p><div class="price"><span>From</span> '+p[2]+'</div><ul><li>Choice of colours</li><li>Professionally applied spray finish</li><li>Written workmanship guarantee</li><li>Extras quoted separately</li></ul>'+btn('Request a tailored quote','/contact/',i!==1)+'</article>').join('') + '</div>'; }

function heroMiniForm(query={},siteKey='') {
  if(query.sent==='1' || query.sent===1) {
    return '<aside class="hero-quick-card hero-quick-success" id="hero-enquiry" aria-label="Enquiry confirmation"><span class="hero-quick-kicker">Enquiry received</span><h2>Thanks for getting in touch.</h2><p>We have received your details and will be in touch to discuss your kitchen.</p><a class="hero-quick-secondary" href="/contact/">Tell us more about your project ↗</a></aside>';
  }
  const notice = query.error ? '<p class="hero-quick-error" role="alert">'+e(query.error)+'</p>' : '';
  return '<aside class="hero-quick-card" id="hero-enquiry" aria-labelledby="hero-quick-heading">'+
    '<span class="hero-quick-kicker">Start your kitchen transformation</span><h2 id="hero-quick-heading">Get a free quote.</h2><p class="hero-quick-intro">Just a few details and we will get back to you.</p>'+notice+
    '<form class="hero-quick-form" action="/contact/" method="post">'+
    '<input type="hidden" name="source" value="home-hero">'+
    '<input type="hidden" name="service" value="Kitchen respray">'+
    '<div class="hero-quick-row"><label>Name <input name="name" required maxlength="100" autocomplete="name" placeholder="Your name"></label>'+
    '<label>Phone <input name="phone" type="tel" required maxlength="45" autocomplete="tel" placeholder="Your number"></label></div>'+
    '<label>Email address <input name="email" type="email" required maxlength="150" autocomplete="email" placeholder="you@example.com"></label>'+
    '<label>Kitchen details <span class="hero-quick-optional">(optional)</span><textarea name="message" rows="2" maxlength="3000" placeholder="e.g. 12 doors, looking for a fresh colour"></textarea></label>'+
    '<input class="trap" tabindex="-1" name="website" autocomplete="off" aria-hidden="true">'+
    '<label class="hero-quick-consent"><input type="checkbox" name="consent" value="yes" required><span>I agree to be contacted about my enquiry. <a href="/privacy/">Privacy notice</a>.</span></label>'+
    (siteKey?'<div class="cf-turnstile" data-size="compact" data-sitekey="'+e(siteKey)+'"></div>':'')+
    '<button class="btn btn-primary hero-quick-submit" type="submit">Request my free quote <span aria-hidden="true">↗</span></button>'+
    '</form><a class="hero-quick-secondary" href="/contact/">Prefer a detailed enquiry? ↗</a></aside>';
}

function home(media, settings, query={}, siteKey='') {
  const hero = textImage(media.find(x => x.featured) || media[0]);
  const title = settings.heroTitle || 'A fresh look for the heart of your home.';
  const subtitle = settings.heroSubtitle || 'Beautifully finished kitchen doors and cabinets. Expertly sprayed in Scotland, without the cost and disruption of a full replacement.';
  return '<section class="hero editorial-hero"><img class="hero-img" src="' + e(hero) + '" alt="Contemporary kitchen with freshly styled cabinetry"><div class="wrap hero-content"><div class="hero-copy"><span class="eyebrow light">Kitchen spraying specialists · Glasgow & Scotland</span><h1>Professional Kitchen Spraying in Glasgow &amp; Across Scotland</h1><p class="hero-tagline">' + e(title) + '</p><p>' + e(subtitle) + '</p><div class="hero-actions">' + btn('Get a free quote','/contact/') + btn('See how it works','/how-it-works/',true) + '</div><div class="hero-proof"><span>Based in Clydebank</span><span>Two-year workmanship guarantee</span><span>Fully insured</span></div></div>'+heroMiniForm(query,siteKey)+'</div><div class="hero-photo-caption">Professional cabinet &amp; door spraying <span aria-hidden="true">↗</span></div></section>'
  + '<section class="intro-strip"><div class="wrap intro-grid"><div><span class="eyebrow">A smarter kitchen makeover</span><h2>Beautiful kitchens do not have to start over.</h2></div><div><p>If your kitchen works but its colour or finish no longer does, professional spraying can make all the difference. We give existing cabinetry the care and attention it deserves.</p>' + btn('Explore our services','/kitchen-spraying/',true) + '</div></div></section>'
  + why() + ralSection() + finishingTouches(true) + '<section class="section"><div class="wrap"><div class="section-header-row">' + sectionHead('The possibilities','Finishes worth falling for','From light, timeless cabinetry to moody contemporary shades, discover what a new colour can do.') + btn('Explore gallery','/gallery/',true) + '</div>' + photoGrid(media,6) + '</div></section>'
  + '<section class="section soft-section"><div class="wrap split align-centre"><div>' + sectionHead('From first chat to final reveal','An expert process, made simple','We combine careful preparation with specialist spray finishing at our facility near Glasgow.') + '<p>For removable components, the best finish starts away from your home. Each step is planned to keep the project straightforward and the result consistent.</p>' + btn('See the full process','/how-it-works/') + '</div><div>' + steps() + '</div></div></section>'
  + '<section class="section"><div class="wrap">' + sectionHead('Straightforward starting points','Pricing without the mystery','Guide prices from the current website. Your final quotation depends on your kitchen and any requested upgrades.') + priceCards() + '</div></section>'
  + '<section class="section areas-section"><div class="wrap split"><div>' + sectionHead('Local expertise','Proudly serving central Scotland','Based in Clydebank, we work with homeowners across Glasgow, Ayrshire, Lanarkshire, Edinburgh and Stirling.') + btn('Check your postcode','/contact/',true) + '</div><div class="area-links">' + areas.map(a=>'<a href="/kitchen-spraying-'+a.slug+'/"><span>Kitchen spraying in '+a.name+'</span><span aria-hidden="true">↗</span></a>').join('') + '</div></div></section>' + faqHtml() + cta();
}
const serviceCopy = {
  general: {
    heading: 'Professional Kitchen Spraying Services in Scotland',
    intro: 'Transform your existing kitchen with specialist door, drawer and cabinet spraying, without replacing the layout you already love.',
    kicker: 'The complete kitchen refresh',
    sectionTitle: 'Kitchen spraying that makes the most of what you have',
    lead: 'A coordinated finish across your existing kitchen can create a completely different look.',
    description: 'We start by assessing the condition and materials of your doors, drawer fronts and other visible cabinetry. Suitable removable parts are carefully prepared and professionally sprayed at our Clydebank-area facility. Any fixed panels or trim that might need attention are discussed separately as part of your quotation.',
    checklist: ['Assessment of suitable doors, drawer fronts and trim', 'Colour and finish choices to suit your kitchen', 'Professional preparation and off-site spraying', 'Quality checks and refitting of removable components', 'Written two-year workmanship guarantee'],
    detailKicker: 'What makes a kitchen respray different?',
    detailTitle: 'A new finish, not a new layout',
    detailLead: 'Keep serviceable units, worktops and appliances where they are, unless you choose additional work.',
    detailText: 'Kitchen spraying concentrates on the surfaces you see rather than the structure behind them. We can discuss matching colours across doors and panels and whether optional handles, worktops, sinks or taps would help complete the result.',
    detailList: ['Ideal starting point when your kitchen layout still works', 'Scope agreed after assessing the existing surfaces', 'See our kitchen respray prices for guide costs']
  },
  cabinet: {
    heading: 'Kitchen Cabinet Spraying',
    intro: 'Give existing kitchen cupboards and cabinet fronts a considered new finish with specialist preparation, spraying and refitting.',
    kicker: 'Cabinet refinishing specialists',
    sectionTitle: 'Fresh colour for tired kitchen cabinets',
    lead: 'A cabinet makeover starts with the surfaces, condition and finish of your existing units.',
    description: 'Cabinet doors, drawer fronts, visible end panels and surrounding trim can have different surfaces and preparation needs. We assess which components are suitable for spraying, discuss edge profiles and existing finishes, and explain what will be removed for work at our spray facility. Fixed cabinetry is considered separately where appropriate.',
    checklist: ['Suitability checks for existing cabinet materials', 'Preparation of door faces, edges and details', 'Colour and sheen choices for a coordinated result', 'Separate assessment of fixed panels and trim', 'Refitting and final checks on agreed components'],
    detailKicker: 'Cabinet spraying explained',
    detailTitle: 'The details matter as much as the colour',
    detailLead: 'Door edges, drawer fronts and visible panels all affect how the finished kitchen looks.',
    detailText: 'A clear quotation should describe exactly which cabinet parts will be refinished. Ask us about the difference between removable fronts and fixed units, any repairs that might be needed and whether new handles would suit the updated colour.',
    detailList: ['Discuss existing cabinet material and condition', 'Confirm which faces, edges and panels are included', 'Explore suitable RAL colour references and finishes']
  },
  door: {
    heading: 'Kitchen Door Spraying',
    intro: 'Refresh kitchen doors and drawer fronts with carefully managed removal, specialist spray finishing and professional refitting.',
    kicker: 'Kitchen doors and drawer fronts',
    sectionTitle: 'Change the doors’ appearance, keep the kitchen you know',
    lead: 'The colour and finish of kitchen doors can have an outsized effect on the whole room.',
    description: 'We assess your existing door fronts and drawer fronts before agreeing the spraying scope. Suitable pieces are carefully removed, prepared and coated at our specialist facility before being returned and refitted. Profiles, handles, hinges and the condition of the current surfaces are considered during the initial discussion.',
    checklist: ['Door and drawer-front condition assessment', 'Careful removal of suitable removable fronts', 'Preparation of faces, edges and profiles', 'Spraying, finish checks and professional refitting', 'Options to discuss replacement handles separately'],
    detailKicker: 'Door respraying advice',
    detailTitle: 'What about hinges, handles and drawer fronts?',
    detailLead: 'The small components are worth considering before choosing the final colour.',
    detailText: 'If your door shapes and layout still suit the room, respraying may be a practical alternative to buying replacements. We can discuss whether existing handles should be retained, whether new hardware would complement the finish, and which drawer fronts or matching panels should be included.',
    detailList: ['Send photographs showing door profiles and their condition', 'Count doors and drawer fronts for a useful starting quote', 'Ask about matching handles and adjacent panels']
  }
};
function genericService(type, media) {
  const c = serviceCopy[type];
  const index = type === 'door' ? 2 : type === 'cabinet' ? 1 : 0;
  return banner('Our expertise', c.heading, c.intro, interiorImage(media, index), 'Spray-painted kitchen cabinet detail')
    + '<section class="section"><div class="wrap split align-centre"><div>'
    + sectionHead(c.kicker, c.sectionTitle, c.lead)
    + '<p>' + e(c.description) + '</p>'
    + btn('Get a no-obligation quote','/contact/')
    + '</div><div class="feature-panel"><span class="eyebrow">What we consider</span><ul class="check-list">'
    + c.checklist.map(item => '<li>' + e(item) + '</li>').join('')
    + '</ul></div></div></section>'
    + '<section class="section soft-section"><div class="wrap split align-centre"><div>'
    + sectionHead(c.detailKicker, c.detailTitle, c.detailLead)
    + '<p>' + e(c.detailText) + '</p>'
    + btn('Explore guide prices','/kitchen-respray-cost/',true)
    + '</div><div class="feature-panel"><span class="eyebrow">Worth knowing</span><ul class="check-list">'
    + c.detailList.map(item => '<li>' + e(item) + '</li>').join('')
    + '</ul></div></div></section>'
    + why()
    + '<section class="section soft-section"><div class="wrap">'
    + sectionHead('How it happens','Four steps to a fresh finish','A clear process from your initial enquiry to the final reveal.')
    + steps() + '</div></section>'
    + ralSection() + finishingTouches() + faqHtml() + cta();
}
function costs(media) {return banner('An investment in your home','How much does a kitchen respray cost?','Clear starting prices for professionally sprayed kitchen doors and cabinets in Scotland.', interiorImage(media,3))+'<section class="section"><div class="wrap">'+sectionHead('Our guide prices','Your kitchen, your quote','These are advertised starting prices, not fixed quotations. The exact cost varies by door count, cabinet condition, preparation needs and selected extras.')+priceCards()+'<p class="muted note">Prices and package descriptions were carried forward from the previous website. Confirm current prices with the team before making a decision.</p></div></section><section class="section soft-section"><div class="wrap split"><div>'+sectionHead('What affects the price?','Every kitchen is a little different.','The size and condition of your existing cabinetry, the finish you choose and any optional upgrades all influence the final quotation.')+'</div><div class="feature-panel"><ul class="check-list"><li>Number and size of doors and drawers</li><li>Surface condition and preparation requirements</li><li>Choice of paint colour and finish</li><li>Additional trim and fixed cabinetry</li><li>Optional new handles, worktops, sinks or taps</li></ul></div></div></section>'+finishingTouches()+faqHtml()+cta();}
function processPage(media) {return banner('The process','Craftsmanship at every stage','From careful removal to the final refit, here is how we transform your kitchen.', interiorImage(media,4))+'<section class="section"><div class="wrap split"><div>'+sectionHead('Behind the finish','Where the attention to detail lives','We make the process straightforward and keep you informed along the way.')+'<p>The removable parts of your kitchen travel to our specialist spray centre near Glasgow, where they are prepared and coated in controlled conditions. Suitable fixed areas and extra works are discussed during your quotation.</p>'+btn('Request your quote','/contact/')+'</div>'+steps()+'</div></section>'+why()+faqHtml()+cta();}
function galleryPage(media) {return banner('The lookbook','Colour, finish & inspiration','A closer look at the finishes and kitchen imagery gathered for our refreshed website.', interiorImage(media,1))+'<section class="section"><div class="wrap"><p class="gallery-disclaimer">Images are labelled for inspiration unless separately confirmed as completed customer projects.</p>'+photoGrid(media,100)+'</div></section>'+cta();}
function about(media) {return banner('About us','The detail makes the difference','A dedicated kitchen spraying team based in Clydebank and working throughout central Scotland.', interiorImage(media,5))+'<section class="section"><div class="wrap split align-centre"><div>'+sectionHead('A fresh finish, without the upheaval','The specialists behind the spray','We believe a kitchen that works should have the chance to look its best again.')+'<p>Kitchen Spraying Expert provides kitchen door and cabinet spraying, focusing on preparation, finish quality and careful refitting. We work with homeowners across Glasgow, Ayrshire, Lanarkshire and beyond.</p><p>Our specialist facility near Glasgow allows removable doors and components to be prepared and sprayed before being returned to your home.</p>'+btn('Talk to the team','/contact/')+'</div><div class="feature-panel"><span class="eyebrow">Find us</span><h3>Kitchen Spraying Expert</h3><p>Unit 6, Dunrobin Court<br>14 North Avenue<br>Clydebank<br>G81 2QP, Scotland</p><p><a href="tel:'+TEL+'">'+PHONE+'</a></p></div></div></section>'+why()+cta();}
const localContent = {
  glasgow: {
    title: 'Kitchen spraying for Glasgow flats and family homes',
    details: 'From compact city kitchens to larger family spaces, the first question is whether the existing door and drawer fronts are sound enough to refinish. We can discuss matching the new colour with visible cabinet panels and existing worktops.',
    logistics: 'Our spray facility is in Clydebank. We will confirm collection, refitting, site access and any work on fixed components when reviewing your Glasgow postcode and kitchen photographs.',
    checklist: ['Photograph the kitchen and any damaged door edges', 'Mention stairs, access or parking considerations', 'Ask which panels and frames are included'],
    planningTitle: 'Planning a kitchen respray in Glasgow',
    planningNote: 'A few photographs and your postcode help us assess the likely scope before a visit or quotation.'
  },
  ayrshire: {
    title: 'Kitchen door and cabinet spraying across Ayrshire',
    details: 'Homes in Ayr, Kilmarnock, Irvine and the wider area often have perfectly serviceable kitchen layouts that simply need a different finish. We can discuss whether spraying the doors alone gives the result you want or whether visible panels and trim should be assessed too.',
    logistics: 'For an Ayrshire enquiry, send the postcode, approximate door and drawer count and a few clear photographs. We will confirm coverage, logistics and any collection or refitting arrangements before agreeing the job.',
    checklist: ['Include your town and postcode', 'Count doors and drawers separately', 'Tell us if handles or worktops may also change'],
    planningTitle: 'Preparing your Ayrshire kitchen spraying quote',
    planningNote: 'A clear scope makes it easier to compare the cost of respraying with replacing existing fronts.'
  },
  lanarkshire: {
    title: 'Cabinet refinishing for Lanarkshire kitchens',
    details: 'Whether your kitchen is in East Kilbride, Hamilton or another Lanarkshire town, it is worth checking the condition of each door and drawer front before deciding on a colour. Existing end panels, plinths and fixed trims can also affect how consistent the final result looks.',
    logistics: 'Let us know your Lanarkshire location and which parts of the cabinetry you would like refreshed. We will explain what can be removed for spraying and what needs a separate on-site assessment.',
    checklist: ['Share photos of cabinet fronts and end panels', 'Mention any peeling or damaged finishes', 'Ask about matching fixed trim where suitable'],
    planningTitle: 'Choosing the right scope for your Lanarkshire kitchen',
    planningNote: 'Separating removable doors from fixed cabinetry helps avoid surprises in the final quotation.'
  },
  edinburgh: {
    title: 'Kitchen respraying options for Edinburgh homeowners',
    details: 'If you like the way your Edinburgh kitchen is laid out but want to change its colour, respraying may be worth considering. We begin with photographs and a discussion about the doors, drawer fronts, visible panels and the finish you are hoping to achieve.',
    logistics: 'Availability and transport arrangements for Edinburgh are confirmed when you contact us. We will explain any access requirements, off-site spraying stages and whether additional work is appropriate for your kitchen.',
    checklist: ['Provide the full Edinburgh postcode', 'Show cabinet profiles in close-up photographs', 'Confirm preferred colours and any access constraints'],
    planningTitle: 'Getting an Edinburgh kitchen respray estimate',
    planningNote: 'We will confirm service availability and a practical plan before making commitments about collection or refitting.'
  },
  stirling: {
    title: 'Kitchen door spraying and refinishing in Stirling',
    details: 'A fresh finish can modernise a Stirling kitchen without moving plumbing, appliances or sound existing units. We can assess whether the door fronts and drawer fronts are suitable for spraying and discuss a coordinated colour for visible panels.',
    logistics: 'When enquiring from Stirling or the surrounding area, include your postcode and photographs of the existing finish. We will check the proposed scope and confirm whether off-site spraying and refitting arrangements are suitable.',
    checklist: ['Show the current finish and door profiles', 'Include your postcode for a coverage check', 'Consider whether new handles would complement the colour'],
    planningTitle: 'Plan your Stirling kitchen makeover',
    planningNote: 'Understanding the surfaces and desired finish is the best starting point for a useful quote.'
  }
};
function areaPage(a,media) {
  const local = localContent[a.slug];
  return banner('Local kitchen transformations','Kitchen spraying in ' + a.name,a.intro,interiorImage(media,areas.indexOf(a)+1))
    + '<section class="section"><div class="wrap split"><div>'
    + sectionHead('Your local kitchen refresh', local.title, a.notes)
    + '<p>' + e(local.details) + '</p><p>' + e(local.logistics) + '</p>'
    + btn('Request a ' + a.name + ' quote','/contact/')
    + '</div><div class="feature-panel"><span class="eyebrow">Before requesting a quote</span><ul class="check-list">'
    + local.checklist.map(item => '<li>' + e(item) + '</li>').join('')
    + '</ul><p>We assess each project individually and confirm suitability, scope and pricing before work begins.</p></div></div></section>'
    + '<section class="section soft-section"><div class="wrap">'
    + sectionHead('From enquiry to reveal', local.planningTitle, local.planningNote)
    + steps()
    + '<p class="muted note">Need a starting point? See our <a href="/kitchen-respray-cost/">kitchen respray pricing guide</a> or explore <a href="/kitchen-cabinet-spraying/">cabinet spraying</a>.</p>'
    + '</div></section>'
    + faqHtml() + cta();
}

function ralContactField(query) {
  const initial = typeof query.ral==='string' && /^RAL [0-9]{4}$/i.test(query.ral) ? query.ral.toUpperCase() : '';
  const selected = colourReferences.find(item=>item[0]===initial);
  const previewName = selected ? selected[1] : (initial ? 'Sample unavailable' : 'No shade selected');
  return '<div class="ral-form-field"><label for="preferred-ral">Preferred RAL colour <span>(optional)</span></label>'+
    '<div class="ral-form-row"><input id="preferred-ral" data-ral-form-input type="text" name="ralColour" maxlength="40" list="ral-contact-options" autocomplete="off" placeholder="e.g. RAL 6011" value="'+e(initial)+'">'+
    '<div class="ral-form-preview" data-ral-form-preview aria-live="polite"><span class="ral-form-paint'+(selected?' has-shade':'')+'" data-ral-form-paint'+(selected?' style="background-color:'+selected[2]+'"':'')+' aria-hidden="true"></span>'+
    '<span class="ral-form-description"><strong data-ral-form-name>'+e(previewName)+'</strong><small>Illustrative colour</small></span></div></div>'+
    '<datalist id="ral-contact-options">'+colourReferences.map(item=>'<option value="'+item[0]+'" label="'+e(item[1])+'" data-ral-swatch="'+item[2]+'" data-ral-name="'+e(item[1])+'"></option>').join('')+'</datalist>'+
    '<p class="ral-form-hint">Approximate screen preview only. Confirm your final shade with a physical colour sample.</p></div>';
}

function contact(query, siteKey, media) {
  return banner('Let us talk kitchens','Tell us what you have in mind.','A few details are all we need to start discussing your kitchen makeover.',interiorImage(media,6))+'<section class="section" id="quote-form"><div class="wrap contact-grid"><div class="contact-form-panel">'+(query.sent?'<div class="success" role="status">Thanks — your enquiry has been received. The team will be in touch.</div>':'')+(query.error?'<div class="error" role="alert">Please check the form and try again. '+e(query.error)+'</div>':'')+'<form method="post" action="/contact/" class="quote-form"><div class="field-row"><label>Your name <input name="name" required maxlength="100" autocomplete="name"></label><label>Phone number <input name="phone" required maxlength="45" autocomplete="tel" type="tel"></label></div><div class="field-row"><label>Email address <input name="email" required maxlength="150" autocomplete="email" type="email"></label><label>Postcode <input name="postcode" maxlength="20" autocomplete="postal-code"></label></div><label>What would you like us to help with? <select name="service"><option>Kitchen respray</option><option>Kitchen doors</option><option>Cabinet spraying</option><option>Something else</option></select></label><section class="finishing-fieldset" aria-labelledby="finishing-title"><div class="finishing-heading"><h3 id="finishing-title">Interested in any finishing touches?</h3><span class="finishing-optional">Optional</span></div><p class="finishing-intro">Select any extras to discuss. Quoted separately.</p><div class="finishing-choices">'+extras.map(x=>'<label class="finishing-choice-tile"><input type="checkbox" name="upgrades" value="'+x[0]+'" '+(query.interest==='all'||query.interest===x[0]?'checked':'')+'><span class="tile-check" aria-hidden="true">✓</span><span class="tile-words"><strong>'+e(x[1])+'</strong><small>'+e(x[2])+'</small></span></label>').join('')+'</div></section>'+ralContactField(query)+'<label>Tell us about your kitchen <textarea name="message" required maxlength="3000" rows="6" placeholder="Rough number of doors, preferred colour, location or anything useful..."></textarea></label><input class="trap" tabindex="-1" name="website" autocomplete="off" aria-hidden="true"><label class="consent"><input type="checkbox" required name="consent" value="yes"> I agree to be contacted about my enquiry. See our <a href="/privacy/">privacy notice</a>.</label>'+(siteKey?'<div class="cf-turnstile" data-sitekey="'+e(siteKey)+'"></div>':'')+'<button class="btn btn-primary" type="submit">Send my enquiry <span aria-hidden="true">↗</span></button></form></div><aside class="contact-side"><span class="eyebrow">We would love to hear from you</span><h2>A kitchen you will love, made simple.</h2><p>Have a question or prefer to chat? Give us a call and we can discuss your project.</p><a class="big-phone" href="tel:'+TEL+'">'+PHONE+'</a><hr><h3>Based in Clydebank</h3><p>Unit 6, Dunrobin Court<br>14 North Avenue<br>Clydebank<br>G81 2QP, Scotland</p><p>Serving Glasgow, Ayrshire, Lanarkshire, Stirling, Edinburgh and surrounding areas.</p></aside></div></section>'+faqHtml();
}
function privacy(media) {return banner('Privacy','Your information matters','A short explanation of the information collected through this website.',interiorImage(media,7))+'<section class="section"><div class="wrap prose"><h2>Enquiry information</h2><p>When you send an enquiry, we collect your name, phone number, email address, postcode, requested service and message so that Kitchen Spraying Expert can respond to your request. Please do not send sensitive personal information.</p><h2>How it is used</h2><p>Your details are used to reply to your enquiry and prepare a quotation. Form submissions are stored within this website’s administration system and, when email delivery is configured, sent to the designated business inbox.</p><h2>Storage and access</h2><p>Enquiry details are accessible to authorised administrators. They should be retained only as long as necessary for managing the enquiry and any applicable legal obligations. The website operator should confirm and publish its retention period and data controller contact details before launch.</p><h2>Your rights</h2><p>For access, correction or deletion requests, contact Kitchen Spraying Expert on <a href="tel:'+TEL+'">'+PHONE+'</a>. You can also consult the Information Commissioner’s Office at <a href="https://ico.org.uk/" rel="noopener noreferrer">ico.org.uk</a>.</p></div></section>';}
const GOOGLE_BUSINESS_MAP = 'https://www.google.com/maps/search/?api=1&query=Kitchen%20Spraying%20Expert%20Clydebank&query_place_id=ChIJR2WVf9NPiEgRr7OCATM9DlI';
function schema(path, title, meta, media, siteSettings = {}) {
  const base = { '@context':'https://schema.org', '@type':'HomeAndConstructionBusiness', '@id':BASE+'/#business', name:'Kitchen Spraying Expert', url:BASE+'/', telephone:TEL, description:'Specialist kitchen cabinet and door spraying across central and south-west Scotland.', address:{'@type':'PostalAddress', streetAddress:'Unit 6, Dunrobin Court, 14 North Avenue',addressLocality:'Clydebank',postalCode:'G81 2QP',addressRegion:'Scotland',addressCountry:'GB'}, sameAs:[GOOGLE_BUSINESS_MAP], hasMap:GOOGLE_BUSINESS_MAP, areaServed:areas.map(a=>({'@type':'Place',name:a.name})) };
  if (typeof siteSettings.headerLogoFile === 'string' && /^logo-[a-f0-9-]+\.webp$/.test(siteSettings.headerLogoFile)) {
    base.logo = { '@type':'ImageObject', url: BASE + '/media/' + encodeURIComponent(siteSettings.headerLogoFile) };
  }
  const realProject = media.find(item => ['project','after'].includes(item.category));
  if (realProject) base.image = BASE + '/media/' + encodeURIComponent(realProject.file);
  const crumbs=[{'@type':'ListItem',position:1,name:'Home',item:BASE+'/'}];
  if(path!=='/')crumbs.push({'@type':'ListItem',position:2,name:title.split('|')[0].trim(),item:BASE+path});
  const graph=[base,{'@type':'WebSite','@id':BASE+'/#website',url:BASE+'/',name:'Kitchen Spraying Expert',publisher:{'@id':BASE+'/#business'}},{'@type':'WebPage',url:BASE+path,name:title,description:meta,isPartOf:{'@id':BASE+'/#website'}}, {'@type':'BreadcrumbList',itemListElement:crumbs}];
  if(path.includes('spraying')||path.includes('respray')||path==='/kitchen-upgrades/')graph.push({'@type':'Service',name:title.split('|')[0].trim(),serviceType:path==='/kitchen-upgrades/'?'Optional kitchen finishing touches':'Kitchen cabinet and door spraying',provider:{'@id':BASE+'/#business'},areaServed:areas.map(a=>a.name)});
  if(['/','/contact/','/how-it-works/'].includes(path))graph.push({'@type':'FAQPage',mainEntity:faqs.map(f=>({'@type':'Question',name:f[0],acceptedAnswer:{'@type':'Answer',text:f[1]}}))});
  return JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c');
}

function arrowIcon() {
  return '<svg class="link-arrow-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>';
}
function logoMarkup(siteSettings, forFooter=false) {
  const file = forFooter ? (siteSettings.footerLogoFile || siteSettings.headerLogoFile) : siteSettings.headerLogoFile;
  if (typeof file === 'string' && /^logo-[a-f0-9-]+\.webp$/.test(file)) {
    return '<span class="logo-image-wrap '+(forFooter && !siteSettings.footerLogoFile ? 'logo-image-panel' : '')+'"><img class="brand-logo" src="/media/'+encodeURIComponent(file)+'" width="240" height="72" alt="Kitchen Spraying Expert" decoding="async"></span>';
  }
  return '<span class="brand-words wordmark-fallback">KITCHEN <b>SPRAYING</b><small>EXPERT</small></span>';
}
function navCard(href, heading, details) {
  return '<a class="dropdown-card" href="'+e(href)+'"><span class="dropdown-card-copy"><strong>'+e(heading)+'</strong><small>'+e(details)+'</small></span></a>';
}
function navGroup(id, heading, href, description, links, active) {
  return '<div class="nav-group" data-nav-group><div class="nav-group-toggle"><a href="'+e(href)+'" class="nav-group-main '+(active?'current':'')+'">'+e(heading)+'</a><button type="button" class="nav-chevron" aria-expanded="false" aria-controls="nav-'+id+'" aria-label="Toggle '+e(heading)+' links"><span class="chevron-shape"></span></button></div>'+
    '<div id="nav-'+id+'" class="dropdown"><div class="dropdown-intro"><span class="eyebrow">Explore '+e(heading)+'</span><h3>'+e(heading)+'</h3><p>'+e(description)+'</p></div><div class="dropdown-links">'+links.map(x=>navCard(...x)).join('')+'</div></div></div>';
}
function mainNav(active) {
  const services=[
    ['/kitchen-spraying/','Kitchen spraying','An expert makeover for existing cabinetry'],
    ['/kitchen-cabinet-spraying/','Cabinet spraying','Beautiful colour and a careful finish'],
    ['/kitchen-door-spraying/','Door spraying','Refresh doors and drawer fronts'],
    ['/kitchen-upgrades/','Finishing touches','Handles, worktops, sinks and taps'],
    ['/ral-colours/','RAL colours','Explore shade inspiration and favourites'],
    ['/kitchen-respray-cost/','Prices & packages','Clear guide prices and how quotes work'],
    ['/how-it-works/','Our process','From preparation through to refitting']
  ];
  const locations=areas.map(a=>['/kitchen-spraying-'+a.slug+'/','Kitchen spraying '+a.name,'Local service and advice for homeowners']);
  return '<a '+(active==='home'?'class="current"':'')+' href="/">Home</a>'+
  navGroup('services','Services','/kitchen-spraying/','Explore our specialist kitchen cabinet and door spraying services, pricing and step-by-step process.',services,active==='services')+
  navGroup('locations','Areas','/kitchen-spraying-glasgow/','Find out about kitchen spraying throughout Glasgow, Ayrshire, Lanarkshire and central Scotland.',locations,active==='areas')+
  '<a '+(active==='gallery'?'class="current"':'')+' href="/gallery/">Our work</a>'+
  '<a '+(active==='about'?'class="current"':'')+' href="/about/">About</a>'+
  '<a '+(active==='contact'?'class="current"':'')+' href="/contact/">Contact</a>';
}

export function render(path, media, query={}, settings={}, preview=true, siteKey='') {
  const found=pageData[path]; if(!found)return null;
  const [title,description]=found;
  const active=path==='/'?'home':path==='/contact/'?'contact':path==='/gallery/'?'gallery':path==='/about/'?'about':path.startsWith('/kitchen-spraying-')?'areas':'services';
  let page=path==='/'?home(media,settings,query,siteKey):path==='/kitchen-spraying/'?genericService('general',media):path==='/kitchen-cabinet-spraying/'?genericService('cabinet',media):path==='/kitchen-door-spraying/'?genericService('door',media):path==='/kitchen-respray-cost/'?costs(media):path==='/how-it-works/'?processPage(media):path==='/kitchen-upgrades/'?upgradesPage(media):path==='/ral-colours/'?ralPage(media):path==='/gallery/'?galleryPage(media):path==='/about/'?about(media):path==='/contact/'?contact(query,siteKey,media):path==='/privacy/'?privacy(media):areaPage(areas.find(a=>path==='/kitchen-spraying-'+a.slug+'/'),media);
  if (path !== '/' && page.startsWith('<section class="page-banner">')) {
    page = page.replace('<div class="wrap page-banner-inner"><div class="page-banner-copy">', '<div class="wrap page-banner-inner"><div class="page-banner-copy">' + crumb(path, title.split('|')[0].trim()));
  }
  const ogImg = media.length?BASE+'/media/'+encodeURIComponent(media[0].file):FALLBACK_HERO;
  const canonical=BASE+path;
  return '<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#202e27"><title>'+e(title)+'</title><meta name="description" content="'+e(description)+'"><link rel="canonical" href="'+e(canonical)+'"><meta name="robots" content="'+(preview?'noindex,nofollow,noarchive':'index,follow,max-image-preview:large')+'"><meta property="og:type" content="website"><meta property="og:site_name" content="Kitchen Spraying Expert"><meta property="og:title" content="'+e(title)+'"><meta property="og:description" content="'+e(description)+'"><meta property="og:url" content="'+e(canonical)+'"><meta property="og:image" content="'+e(ogImg)+'"><meta name="twitter:card" content="summary_large_image"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="stylesheet" href="/site.css?v=20261022-heroform"><script type="application/ld+json">'+schema(path,title,description,media,settings)+'</script>'+(siteKey&&(path==='/contact/'||path==='/')?'<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>':'')+'</head><body><a class="skip" href="#main">Skip to content</a><div class="topline"><div class="wrap"><span>Specialist kitchen spraying across central Scotland</span><a href="tel:'+TEL+'">Call us '+PHONE+' ↗</a></div></div><header class="header"><div class="wrap navrow"><a class="brand" href="/" aria-label="Kitchen Spraying Expert home">'+logoMarkup(settings)+'</a><button class="menu-toggle" aria-label="Toggle navigation" aria-controls="main-nav" aria-expanded="false">☰</button><nav id="main-nav" class="main-nav" aria-label="Main navigation">'+mainNav(active)+'</nav><a class="nav-cta" href="/contact/">Free quote '+arrowIcon()+'</a></div></header><main id="main">'+page+'</main><footer class="footer"><div class="wrap footer-top"><div><a class="brand brand-footer" href="/">'+logoMarkup(settings,true)+'</a><p>Expert by name. Expert by finish. Beautifully sprayed kitchen cabinets across Glasgow and central Scotland.</p></div><div><h3>Explore</h3><a href="/kitchen-spraying/">Our services</a><a href="/how-it-works/">How it works</a><a href="/kitchen-respray-cost/">Pricing</a><a href="/gallery/">Gallery</a></div><div><h3>Where we work</h3>'+areas.map(a=>'<a href="/kitchen-spraying-'+a.slug+'/">'+a.name+'</a>').join('')+'</div><div><h3>Get in touch</h3><p>Unit 6, Dunrobin Court<br>14 North Avenue<br>Clydebank, G81 2QP<br>Scotland</p><a href="tel:'+TEL+'">'+PHONE+'</a><a href="/contact/">Request a free quote ↗</a></div></div><div class="wrap footer-bottom"><span>© '+new Date().getFullYear()+' Kitchen Spraying Expert. All rights reserved.</span><span><a href="/privacy/">Privacy</a><a href="/sitemap.xml">Sitemap</a></span></div></footer><script src="/site.js?v=20261022-heroform" defer></script></body></html>';
}
