/* Public catalog: no private paths, raw captures or implementation downloads. */
'use strict';
(() => {
  const data = window.SEIGR_LOGBOOK, $ = s => document.querySelector(s);
  const esc = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const labels = {passed:'Criteria met',not_met:'Criterion not met',awaiting:'Awaiting results',planned:'In preparation',stopped:'Stopped at guard'};
  const current = data.active, completed = data.completed;
  const runs = [...completed, current].flatMap(s => [...(s.prior_runs || []), ...(s.capture ? [s] : [])]);
  const chapter = s => s.chapter;
  if ($('#pending')) $('#pending').innerHTML = `<div><span class="eyebrow">${current.capture ? 'RETURNED' : esc(labels[current.status]).toUpperCase()}</span><p>${esc(current.result)}</p></div><a class="primary" href="${esc(chapter(current))}#${current.capture ? 'results' : 'preparation'}">${current.capture ? 'Read the results' : 'Current experiment'} &#8599;</a>`;
  if ($('#provenance')) $('#provenance').innerHTML = `<dt>Notebook snapshot</dt><dd>${esc(data.generated_at)}</dd><dt>Current experiment</dt><dd>${esc(labels[current.status])}</dd><dt>Returned runs</dt><dd>${runs.length} / ${runs.reduce((n,s) => n + s.observations, 0).toLocaleString('en-GB')} observations</dd><dt>Source snapshot fingerprint / SHA-256</dt><dd><code class="hash">${esc(data.source_fingerprint)}</code></dd>`;
  let filter = 'all';
  function render() {
    const query = $('#search').value.trim().toLowerCase();
    const studies = [...completed, current].filter(s => (filter === 'all' || s.status === filter) && JSON.stringify(s).toLowerCase().includes(query));
    if ($('#sort').value === 'newest') studies.reverse();
    $('#result-count').textContent = `${studies.length} experiments`;
    $('#empty').hidden = studies.length > 0;
    $('#study-list').innerHTML = studies.map(s => {
      const hasResults = s.capture || (s.prior_runs || []).length > 0;
      return `<article class="study-card current-study ${esc(s.status)}"><div class="study-content"><div class="card-meta"><span class="badge ${esc(s.status)}">${esc(labels[s.status])}</span><span>${s.capture ? 'Returned record' : 'Current experiment'}</span></div><h3><a href="${esc(chapter(s))}">${esc(s.title)}</a></h3><p>${esc(s.result)}</p><div class="artifact-links"><a href="${esc(chapter(s))}#method">Method</a>${hasResults ? `<a href="${esc(chapter(s))}#results">Results</a><a href="${esc(chapter(s))}#interpretation">Interpretation</a><a href="${esc(chapter(s))}#evidence">Evidence account</a>` : ''}${!s.capture ? `<a href="${esc(chapter(s))}#preparation">Preparation</a>` : ''}</div></div></article>`;
    }).join('');
    document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
  }
  if ($('#study-list')) {
    document.addEventListener('click', e => { const b = e.target.closest('[data-filter]'); if (b) { filter = b.dataset.filter; render(); } });
    $('#search').addEventListener('input', render); $('#sort').addEventListener('change', render);
    $('#clear-search').addEventListener('click', () => { filter = 'all'; $('#search').value = ''; render(); $('#search').focus(); });
    document.addEventListener('keydown', e => { if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); $('#search').focus(); } });
    render();
  }
})();
