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
