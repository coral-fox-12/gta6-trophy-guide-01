// Boot: load the trophy data, wire the tracker, roadmap and missables views,
// and keep the header progress in step. Runs fully offline — the only fetch
// is the app's own data/trophies.json.
import { loadEarned, saveEarned, loadSpoilerHidden, saveSpoilerHidden, exportProgress, importProgressFile } from './store.js';
import { KIND_LABELS, filterTrophies, gradeCounts, suggestNext } from './filters.js';
import { renderList, renderDetail } from './views.js';
import { renderRoadmap, renderMissables } from './roadmap.js';

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

const state = {
  allTrophies: trophies,
  earned: loadEarned(),
  spoilerHidden: loadSpoilerHidden(),
  selectedId: 28, // Positive Mental Attitude: the one missable trophy, shown first.
  filters: { kind: 'all', grade: 'all', status: 'all', query: '' },
};

const $ = (id) => document.getElementById(id);
const listEl = $('trophy-list');
const metaEl = $('list-meta');
const detailEl = $('detail');

function renderAll() {
  const shown = filterTrophies(trophies, state.filters, state.earned);
  renderList(listEl, metaEl, shown, state, selectTrophy, toggleEarned);
  const selected = trophies.find((t) => t.id === state.selectedId) ?? shown[0];
  renderDetail(detailEl, selected, state, toggleEarned);
  renderProgress();
}

function renderProgress() {
  const n = state.earned.size;
  $('earned-count').textContent = String(n);
  $('bar-fill').style.width = `${Math.round((n / trophies.length) * 100)}%`;
  const counts = gradeCounts(trophies, state.earned);
  $('grade-counts').innerHTML =
    `Platinum <b>${counts.platinum[0]}/${counts.platinum[1]}</b> · ` +
    `Gold <b>${counts.gold[0]}/${counts.gold[1]}</b> · ` +
    `Silver <b>${counts.silver[0]}/${counts.silver[1]}</b> · ` +
    `Bronze <b>${counts.bronze[0]}/${counts.bronze[1]}</b>`;
  $('progress-note').textContent = n === trophies.length
    ? 'Platinum earned — Vice Got a Price! Congratulations, Leonida Legend.'
    : 'Tick a trophy off and it stays ticked — saved in this browser.';
}

function selectTrophy(id) {
  state.selectedId = id;
  renderAll();
  detailEl.scrollIntoView({ block: 'nearest' });
}

function toggleEarned(id, earned) {
  if (earned) state.earned.add(id);
  else state.earned.delete(id);
  saveEarned(state.earned);
  renderAll();
}

function buildKindChips() {
  const host = $('kind-chips');
  const kinds = ['all', 'missable', 'story', 'sidequest', 'collectible', 'activity', 'challenge', 'robbery', 'exploration', 'misc'];
  for (const kind of kinds) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip' + (state.filters.kind === kind ? ' active' : '');
    chip.textContent = kind === 'all' ? 'All' : kind === 'missable' ? 'Missable' : KIND_LABELS[kind];
    chip.addEventListener('click', () => {
      state.filters.kind = kind;
      for (const c of host.children) c.classList.remove('active');
      chip.classList.add('active');
      renderAll();
    });
    host.append(chip);
  }
}

function showView(name) {
  for (const view of ['tracker', 'roadmap', 'missables']) {
    $(`view-${view}`).hidden = view !== name;
    $(`tab-${view}`).classList.toggle('active', view === name);
  }
}

$('search').addEventListener('input', (ev) => {
  state.filters.query = ev.target.value;
  renderAll();
});
$('grade-filter').addEventListener('change', (ev) => {
  state.filters.grade = ev.target.value;
  renderAll();
});
$('status-filter').addEventListener('change', (ev) => {
  state.filters.status = ev.target.value;
  renderAll();
});
$('spoiler-toggle').checked = state.spoilerHidden;
$('spoiler-toggle').addEventListener('change', (ev) => {
  state.spoilerHidden = ev.target.checked;
  saveSpoilerHidden(state.spoilerHidden);
  renderAll();
});
// Suggest next trophy: open the guide for the earliest unearned trophy in
// story order, so a stuck player always has a concrete next step.
$('suggest-btn').addEventListener('click', () => {
  const next = suggestNext(trophies, state.earned);
  if (!next) {
    alert('Every trophy is earned — the platinum is yours, Leonida Legend.');
    return;
  }
  state.filters.kind = 'all';
  state.filters.status = 'all';
  $('status-filter').value = 'all';
  for (const c of $('kind-chips').children) c.classList.toggle('active', c.textContent === 'All');
  selectTrophy(next.id);
});
$('export-btn').addEventListener('click', () => exportProgress(state.earned, trophies.length));
$('import-file').addEventListener('change', async (ev) => {
  const file = ev.target.files[0];
  if (!file) return;
  try {
    const validIds = new Set(trophies.map((t) => t.id));
    state.earned = await importProgressFile(file, validIds);
    saveEarned(state.earned);
    renderAll();
  } catch {
    alert('That file is not a trophy-progress export from this guide.');
  }
  ev.target.value = '';
});
$('reset-btn').addEventListener('click', () => {
  if (confirm('Clear all earned trophies and turn spoilers back on?')) {
    state.earned = new Set();
    saveEarned(state.earned);
    state.spoilerHidden = true;
    saveSpoilerHidden(true);
    $('spoiler-toggle').checked = true;
    renderAll();
  }
});
$('tab-tracker').addEventListener('click', () => showView('tracker'));
$('tab-roadmap').addEventListener('click', () => showView('roadmap'));
$('tab-missables').addEventListener('click', () => showView('missables'));

const sourceList = $('source-list');
for (const s of doc.sources) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = s.url;
  a.textContent = s.name;
  a.target = '_blank';
  a.rel = 'noopener';
  li.append(a);
  li.append(document.createTextNode(` — ${s.what}`));
  sourceList.append(li);
}

buildKindChips();
renderRoadmap($('roadmap'), doc);
renderMissables($('missables'), doc);
renderAll();
// Deep links for screenshots and sharing: #roadmap / #missables open that view.
const hashView = location.hash.replace('#', '');
if (hashView === 'roadmap' || hashView === 'missables') showView(hashView);
