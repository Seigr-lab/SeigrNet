/* Shared navigation for the site and nested project notebooks. */
'use strict';
(() => {
  const container = document.getElementById('header-container');
  if (!container || container.querySelector('.site-header')) return;
  const base = container.dataset.basePath || '';
  const file = location.pathname.split('/').pop();
  const section = file === 'insektsreservat.html' ? 'reserve'
    : file === 'sound.html' ? 'sound' : file === 'manifesto.html' ? 'manifesto' : 'lab';
  const links = [
    ['lab', 'index.html', 'Seigr Lab'],
    ['reserve', 'html/insektsreservat.html', 'Insect Reserve'],
    ['sound', 'html/sound.html', 'Sound'],
    ['manifesto', 'html/manifesto.html', 'Manifesto']
  ];
  const header = document.createElement('header'); header.className = 'site-header';
  const brand = document.createElement('a'); brand.className = 'site-brand'; brand.href = base + 'index.html';
  const logo = document.createElement('img'); logo.src = base + 'assets/seigr_logo.png'; logo.width = 44; logo.height = 44; logo.alt = '';
  const name = document.createElement('span'); name.textContent = 'Seigr';
  const tagline = document.createElement('small'); tagline.textContent = 'a continuum of code, sound, and nature';
  name.append(tagline); brand.append(logo, name);
  const nav = document.createElement('nav'); nav.className = 'site-nav'; nav.setAttribute('aria-label', 'Seigr');
  for (const [key, href, text] of links) {
    const a = document.createElement('a'); a.href = base + href; a.textContent = text;
    if (key === section) a.setAttribute('aria-current', 'page');
    nav.append(a);
  }
  header.append(brand, nav); container.append(header);
})();
