/* Shared offline notebook navigation; chapter content remains readable without JS. */
'use strict';
(() => {
  const current = document.body.dataset.chapter;
  const kind = document.body.dataset.kind;
  // Preserve existing entry points while giving each collection its own page.
  if (current === 'index' && location.hash) {
    const hash = location.hash.slice(1);
    const destination = {studies:'experiments.html', evidence:'evidence.html',
      method:'method.html', review:'evidence.html#provenance-section'}[hash];
    if (destination) {
      location.replace(destination);
      return;
    }
  }
  const sidebar = document.querySelector('.sidebar');
  // HTML contains the complete navigation, including when JavaScript is disabled.
  sidebar.querySelectorAll('a[data-page]').forEach(a => {
    if (a.dataset.page === current) a.setAttribute('aria-current','page');
    else if (a.dataset.page === 'experiments' && kind === 'experiment') a.setAttribute('aria-current','location');
  });
  const compact = matchMedia('(max-width:800px)');
  const menu = sidebar.querySelector('.chapter-menu');
  const resizeMenu = () => { menu.open = !compact.matches; };
  resizeMenu();
  compact.addEventListener('change', resizeMenu);
  const toc = document.querySelector('.page-toc');
  if (toc) {
    const title = document.createElement('p'); title.className='eyebrow'; title.textContent='ON THIS PAGE';
    const nav = document.createElement('nav'); nav.setAttribute('aria-label','On this page');
    document.querySelectorAll('.chapter-content > section[id]').forEach(section => {
      const heading = section.querySelector('h2');
      if (!heading) return;
      const a=document.createElement('a'); a.href='#'+section.id; a.textContent=heading.textContent;
      nav.append(a);
    });
    toc.append(title,nav);
  }
})();
