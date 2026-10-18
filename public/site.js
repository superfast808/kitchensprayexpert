const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('main-nav');
const groups = [...document.querySelectorAll('[data-nav-group]')];

function closeGroups(except = null) {
  for (const group of groups) {
    if (group === except) continue;
    group.classList.remove('is-open');
    group.querySelector('.nav-chevron')?.setAttribute('aria-expanded', 'false');
  }
}
function closeNav() {
  nav?.classList.remove('open');
  toggle?.setAttribute('aria-expanded','false');
  if (toggle) toggle.textContent = '☰';
  closeGroups();
}
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '×' : '☰';
    if (!open) closeGroups();
  });
}
for (const group of groups) {
  const button = group.querySelector('.nav-chevron');
  button?.addEventListener('click', () => {
    const open = !group.classList.contains('is-open');
    closeGroups(group);
    group.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
  });
}
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeNav();
    toggle?.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header')) closeGroups();
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 1100) closeNav();
});


// RAL colour inspiration: select a shade, explore families, carry the code into a quote.
for (const board of document.querySelectorAll('[data-ral-board]')) {
  const swatches=[...board.querySelectorAll('[data-ral-shade]')];
  const filters=[...board.querySelectorAll('[data-ral-filter]')];
  const code=board.querySelector('[data-ral-code]');
  const name=board.querySelector('[data-ral-name]');
  const link=board.querySelector('[data-ral-link]');
  function selectShade(tile) {
    if(!tile)return;
    for (const swatch of swatches)swatch.setAttribute('aria-pressed',String(swatch===tile));
    board.style.setProperty('--ral-preview',tile.dataset.ralColour);
    if(code)code.textContent=tile.dataset.ralShade;
    if(name)name.textContent=tile.dataset.ralName;
    if(link)link.href='/contact/?ral='+encodeURIComponent(tile.dataset.ralShade)+'#quote-form';
  }
  for(const swatch of swatches)swatch.addEventListener('click',()=>selectShade(swatch));
  for(const filter of filters){
    filter.addEventListener('click',()=>{
      for(const button of filters)button.setAttribute('aria-pressed',String(button===filter));
      const group=filter.dataset.ralFilter;
      for(const swatch of swatches)swatch.hidden=group!=='All colours' && swatch.dataset.ralGroup!==group;
      if(swatches.find(x=>x.getAttribute('aria-pressed')==='true')?.hidden){
        selectShade(swatches.find(x=>!x.hidden));
      }
    });
  }
}


// Preferred RAL colour: show the selected shade beside the enquiry input.
// The data comes from the same illustrative swatches as the public RAL explorer.
for (const field of document.querySelectorAll('.ral-form-field')) {
  const input=field.querySelector('[data-ral-form-input]');
  const chip=field.querySelector('[data-ral-form-paint]');
  const caption=field.querySelector('[data-ral-form-name]');
  const preview=field.querySelector('[data-ral-form-preview]');
  if(!input||!chip||!caption||!preview)continue;
  const options=[...field.querySelectorAll('datalist option[data-ral-swatch]')];
  const palette=new Map(options.map(option=>[
    option.value.toUpperCase(),
    {hex:option.dataset.ralSwatch,name:option.dataset.ralName}
  ]));
  const updatePreview=()=>{
    const code=input.value.toUpperCase().trim().replace(/\s+/g,' ');
    const match=palette.get(code);
    chip.classList.toggle('has-shade',!!match);
    chip.style.backgroundColor=match ? match.hex : '';
    // Reset the coloured background when a user clears an existing selection.
    if(!match)chip.style.removeProperty('background-color');
    caption.textContent=match ? match.name : (code ? 'Shade not previewed' : 'No shade selected');
    preview.setAttribute('aria-label',match
      ? code+' '+match.name+' - illustrative colour only'
      : (code ? 'No digital preview for '+code : 'No RAL colour selected'));
  };
  input.addEventListener('input',updatePreview);
  input.addEventListener('change',updatePreview);
  updatePreview();
}
