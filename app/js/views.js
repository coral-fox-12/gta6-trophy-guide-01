// Tracker views: the trophy list and the detail pane beside it. Every trophy
// shows its official name, description and grade, its kind and chapter, and a
// guide in our own words with its named, linked source.
import { KIND_LABELS, isSpoilerMasked } from './filters.js';

const OFFICIAL_LIST = {
  name: 'Exophase — GTA VI trophy list',
  url: 'https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/',
};

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

function gradeDot(grade) {
  const dot = el('span', `grade-dot grade-${grade}`);
  dot.title = grade;
  return dot;
}

export function renderList(listEl, metaEl, trophies, state, onSelect, onToggle) {
  listEl.replaceChildren();
  if (trophies.length === 0) {
    listEl.append(el('li', 'empty', 'No trophies match these filters.'));
  }
  for (const t of trophies) {
    const masked = isSpoilerMasked(t, state.spoilerHidden, state.earned);
    const li = el('li', 'trophy-row' + (state.earned.has(t.id) ? ' earned' : '') + (state.selectedId === t.id ? ' selected' : ''));
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = state.earned.has(t.id);
    box.setAttribute('aria-label', `Mark ${masked ? 'hidden trophy' : t.name} earned`);
    // Keep the click off the row: the row's click selects the trophy and
    // re-renders the list, which would detach this box before its change
    // event fires.
    box.addEventListener('click', (ev) => ev.stopPropagation());
    box.addEventListener('change', (ev) => {
      ev.stopPropagation();
      onToggle(t.id, box.checked);
    });
    li.append(box);
    const body = el('div', 'row-body');
    const name = el('div', 'row-name');
    name.append(gradeDot(t.grade));
    name.append(document.createTextNode(masked ? 'Hidden trophy' : t.name));
    body.append(name);
    body.append(el('div', 'row-desc', masked ? 'Hidden on PS5 until earned — turn spoilers off to reveal it.' : t.description));
    const tags = el('div', 'row-tags');
    tags.append(el('span', 'tag', KIND_LABELS[t.kind] ?? t.kind));
    if (t.chapter) tags.append(el('span', 'tag chapter', `Chapter ${t.chapter}`));
    if (t.missable) tags.append(el('span', 'tag missable', 'Possibly missable'));
    if (t.hidden) tags.append(el('span', 'tag hidden-tag', 'Hidden on PS5'));
    body.append(tags);
    li.append(body);
    li.addEventListener('click', () => onSelect(t.id));
    listEl.append(li);
  }
  const shown = trophies.length;
  const total = state.allTrophies.length;
  metaEl.textContent = shown === total
    ? `Showing all ${total} trophies.`
    : `Showing ${shown} of ${total} trophies.`;
}

export function renderDetail(detailEl, trophy, state, onToggle) {
  detailEl.replaceChildren();
  if (!trophy) {
    detailEl.append(el('h2', '', 'Pick a trophy'));
    detailEl.append(el('p', 'detail-guide', 'Select any trophy in the list to see its guide, its sources and when it can be missed.'));
    return;
  }
  const masked = isSpoilerMasked(trophy, state.spoilerHidden, state.earned);
  const earned = state.earned.has(trophy.id);
  detailEl.append(el('h2', '', masked ? 'Hidden trophy' : trophy.name));
  const meta = el('p', 'detail-meta');
  const grade = el('span', `grade-label ${trophy.grade}`, trophy.grade);
  meta.append(grade);
  meta.append(document.createTextNode(` · ${KIND_LABELS[trophy.kind] ?? trophy.kind}`));
  if (trophy.chapter) meta.append(document.createTextNode(` · Chapter ${trophy.chapter}`));
  if (trophy.hidden) meta.append(document.createTextNode(' · Hidden on PS5'));
  detailEl.append(meta);

  // The citation sits at the top of the pane, so it is visible even when the
  // guide below it is long.
  const srcTop = el('p', 'source-line', 'Guide source: ');
  const aTop = document.createElement('a');
  aTop.href = trophy.source.url;
  aTop.textContent = trophy.source.name;
  aTop.target = '_blank';
  aTop.rel = 'noopener';
  srcTop.append(aTop);
  detailEl.append(srcTop);

  detailEl.append(el('p', 'detail-label', 'Official description'));
  detailEl.append(el('p', 'detail-official', masked ? 'Hidden on PS5 until earned.' : `“${trophy.description}”`));

  if (trophy.missable) {
    const callout = el('div', 'missable-callout');
    callout.innerHTML = '<b>Possibly missable.</b> ';
    callout.append(document.createTextNode('The first meditation, in Chapter 1, may be gone after that chapter — do it when it is offered. Everything else on the list can be finished after the story.'));
    detailEl.append(callout);
  }

  detailEl.append(el('p', 'detail-label', 'Guide — in our own words'));
  detailEl.append(el('p', 'detail-guide', masked ? 'Turn spoilers off, or earn this trophy, to read its guide.' : trophy.guide));

  const list = el('p', 'source-line', 'Official name, description and grade: ');
  const b = document.createElement('a');
  b.href = OFFICIAL_LIST.url;
  b.textContent = OFFICIAL_LIST.name;
  b.target = '_blank';
  b.rel = 'noopener';
  list.append(b);
  detailEl.append(list);

  const toggle = el('button', 'earned-toggle', earned ? '✓ Earned — click to unmark' : 'Mark as earned');
  toggle.type = 'button';
  toggle.addEventListener('click', () => onToggle(trophy.id, !earned));
  detailEl.append(toggle);
}
