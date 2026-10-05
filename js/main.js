// Mobile menu
const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');
menuBtn.addEventListener('click', () => menuBtn.setAttribute('aria-expanded', menu.classList.toggle('open')));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }));

// Highlight the nav link for the section in view
const linkFor = {};
menu.querySelectorAll('a[href^="#"]').forEach(a => linkFor[a.getAttribute('href').slice(1)] = a);
const spy = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting && linkFor[e.target.id]) {
    Object.values(linkFor).forEach(a => a.classList.remove('active'));
    linkFor[e.target.id].classList.add('active');
  }
}), { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

// Project filters
const tabs = document.querySelectorAll('.tab');
tabs.forEach(t => t.addEventListener('click', () => {
  const f = t.dataset.filter;
  tabs.forEach(b => b.setAttribute('aria-pressed', b === t));
  document.querySelectorAll('.tile').forEach(p => p.classList.toggle('hidden', f !== 'all' && p.dataset.cat !== f));
  document.querySelectorAll('[data-cat-block]').forEach(b => b.style.display = (f === 'all' || f === b.dataset.catBlock) ? '' : 'none');
}));

// Case study modal
const modal = document.getElementById('case-modal');
const body = document.getElementById('case-body');
const label = document.getElementById('case-label');
function openCase(id) {
  const tpl = document.getElementById(id);
  if (!tpl) return;
  body.replaceChildren(tpl.content.cloneNode(true));
  label.textContent = 'Case study · ' + body.querySelector('.cs-title').textContent;
  modal.showModal();
  modal.querySelector('.modal').scrollTop = 0;
  if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
}
document.querySelectorAll('[data-open]').forEach(el => el.addEventListener('click', () => openCase(el.dataset.open)));
modal.addEventListener('close', () => {
  body.querySelectorAll('video').forEach(v => v.pause());
  if (location.hash.startsWith('#p-')) history.replaceState(null, '', location.pathname + location.search);
});
modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => b.closest('dialog').close()));
if (location.hash.startsWith('#p-')) openCase(location.hash.slice(1));

// Lightbox for case-study images
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCap = document.getElementById('lb-cap');
body.addEventListener('click', e => {
  const img = e.target.closest('img');
  if (!img) return;
  lbImg.src = img.src; lbImg.alt = img.alt;
  const cap = img.closest('figure') && img.closest('figure').querySelector('figcaption');
  lbCap.textContent = cap ? cap.textContent : img.alt;
  lb.showModal();
});
lb.addEventListener('click', () => lb.close());
