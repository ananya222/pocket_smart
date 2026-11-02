(() => {
 const table = document.querySelector('.braille-table');
 if (!table) return;
 const rows = [...table.querySelectorAll('tbody tr')];
 const copy = document.querySelector('#walk-copy');
 const scan = document.querySelector('#scan-braille');
 const pause = document.querySelector('#pause-braille');
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 let timer, index = 0, paused = false;
 const finishRow = row => {
  row.removeAttribute('data-scanning');
  const valid = row.dataset.valid === 'true';
  const result = row.querySelector('[data-result]');
  result.textContent = valid ? '✓ No errors' : row.dataset.error;
  const corrected = row.querySelector('[data-corrected-result]');
  corrected.textContent = row.dataset.corrected;
  corrected.setAttribute('aria-label', row.dataset.correctedLabel);
  result.dataset.state = valid ? 'correct' : 'wrong';
 };
 const tick = () => {
  if (index > 0) finishRow(rows[index - 1]);
  if (index === rows.length) {
   copy.textContent = 'I found two correct translations and one error: dog ends with ⠞ (t) instead of ⠛ (g).';
   pause.hidden = true;
   return;
  }
  rows[index].setAttribute('data-scanning', '');
  rows[index].querySelector('[data-result]').textContent = 'Scanning…';
  index += 1;
  timer = setTimeout(tick, 1200);
 };
 const start = () => {
  clearTimeout(timer); index = 0; paused = false;
  pause.textContent = 'Pause'; pause.setAttribute('aria-pressed', 'false');
  pause.hidden = reduced.matches;
  rows.forEach(row => {
   row.removeAttribute('data-scanning');
   const result = row.querySelector('[data-result]');
   result.textContent = 'Waiting'; delete result.dataset.state;
   const corrected = row.querySelector('[data-corrected-result]');
   corrected.textContent = '—'; corrected.removeAttribute('aria-label');
  });
  copy.textContent = 'I compare each English word with its converted Braille, identify errors, and show the corrected Braille.';
  if (reduced.matches) {
   rows.forEach(finishRow); index = rows.length; tick();
  } else tick();
 };
 pause.addEventListener('click', () => {
  paused = !paused;
  pause.textContent = paused ? 'Resume' : 'Pause';
  pause.setAttribute('aria-pressed', String(paused));
  if (paused) clearTimeout(timer); else timer = setTimeout(tick, 1200);
 });
 scan.addEventListener('click', start);
 reduced.addEventListener('change', start);
 start();
})();
