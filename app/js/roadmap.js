// Roadmap and missables views, built from the official descriptions and the
// cited guides (PowerPyx for the roadmap numbers, GTABase for the 100%
// checklist and the story chapters).
export function renderRoadmap(host, doc) {
  host.replaceChildren();
  const rm = doc.roadmap;
  const h = document.createElement('h2');
  h.textContent = 'Road to the platinum';
  host.append(h);
  const facts = document.createElement('p');
  facts.className = 'roadmap-facts';
  facts.innerHTML =
    `Difficulty <b>${rm.difficulty}</b> · Time to platinum <b>${rm.time_to_platinum}</b> · ` +
    `Playthroughs <b>${rm.playthroughs}</b> · Online trophies <b>${rm.online_trophies}</b> · ` +
    `Missable trophies <b>${rm.missable}</b>`;
  host.append(facts);

  for (const step of rm.steps) {
    const card = document.createElement('div');
    card.className = 'roadmap-step';
    const title = document.createElement('h3');
    title.textContent = `Step ${step.step}: ${step.title}`;
    card.append(title);
    const time = document.createElement('p');
    time.className = 'step-time';
    time.textContent = step.time;
    card.append(time);
    const text = document.createElement('p');
    text.textContent = step.text;
    card.append(text);
    host.append(card);
  }

  const chTitle = document.createElement('h3');
  chTitle.textContent = 'Story order — chapter trophies';
  host.append(chTitle);
  const order = document.createElement('ol');
  order.className = 'chapter-order';
  const story = doc.trophies
    .filter((t) => t.kind === 'story' && t.chapter)
    .sort((a, b) => a.chapter - b.chapter || a.id - b.id);
  for (const t of story) {
    const li = document.createElement('li');
    li.textContent = `Chapter ${t.chapter} — ${t.name} (${t.grade})`;
    order.append(li);
  }
  host.append(order);
  const orderNote = document.createElement('p');
  orderNote.textContent =
    'Chapter order from GTABase. Three chapter trophies pop a little late: Paradise Lost once Chapter 2 starts, ' +
    'T**s Ass Drug Money as Chapter 3 begins, and Vice City, Baby! after the first two missions of Chapter 4.';
  host.append(orderNote);

  const clTitle = document.createElement('h3');
  clTitle.textContent = 'The 100% checklist (A Long Road) — what it really wants';
  host.append(clTitle);
  const note = document.createElement('p');
  note.textContent =
    'The checklist appears under Progress > Stats > 100% Completion after the story, but everything you did ' +
    'before already counts. It is lenient — closer to 60% true completion, per PowerPyx. Source: GTABase.';
  host.append(note);
  const table = document.createElement('table');
  table.className = 'checklist';
  table.innerHTML =
    '<thead><tr><th>Needed in full</th><th>Needed in part</th></tr></thead><tbody>' +
    '<tr><td>All robberies, all 8 bank vaults, all 39 gang operations</td><td>100 optional missions</td></tr>' +
    '<tr><td>All underwater discoveries</td><td>200 of 277 vehicle scans</td></tr>' +
    '<tr><td>Every Shooting Range gold medal (42)</td><td>100 of 255 animal studies</td></tr>' +
    '<tr><td>All drone races (42)</td><td>15 of 18 meditations</td></tr>' +
    '<tr><td>Bret’s 15 Target Decks</td><td>70 of 80 challenges · 300 stunts · 100 WAiNK scans</td></tr>' +
    '</tbody>';
  host.append(table);
}

export function renderMissables(host, doc) {
  host.replaceChildren();
  const hero = document.createElement('div');
  hero.className = 'missable-hero';
  const h = document.createElement('h2');
  h.textContent = '1 possibly-missable trophy';
  hero.append(h);
  const p = document.createElement('p');
  p.textContent =
    'Positive Mental Attitude — meditate at every spot across Leonida (18 spots). PowerPyx and GTABase both ' +
    'flag it, and only as a maybe: the first meditation is offered in Chapter 1, the morning after Down to ' +
    'Earth, when Lucia meditates on the balcony at home. Follow her from the kitchen and accept it. It is gone ' +
    'after Chapter 1, and it is not confirmed yet whether the trophy needs that exact spot — so do not skip it. ' +
    'Meditating at a spot with Jason and Lucia together counts twice, and the last spot needs both characters, ' +
    'possible after Coffee Break in Chapter 2. Track it under Progress > Collections > Exploration > Meditations.';
  hero.append(p);
  const src = document.createElement('p');
  src.className = 'source-line';
  src.textContent = 'Sources: ';
  const a1 = document.createElement('a');
  a1.href = 'https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/';
  a1.textContent = 'PowerPyx — GTA 6 Trophy Guide & Roadmap';
  a1.target = '_blank';
  a1.rel = 'noopener';
  src.append(a1);
  src.append(document.createTextNode(' · '));
  const a2 = document.createElement('a');
  a2.href = 'https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series';
  a2.textContent = 'GTABase — GTA 6 Trophy Guide';
  a2.target = '_blank';
  a2.rel = 'noopener';
  src.append(a2);
  hero.append(src);
  host.append(hero);

  const safe = document.createElement('div');
  safe.innerHTML =
    '<h3>Everything else is safe after the story</h3>' +
    '<ul class="safe-list">' +
    '<li><b>No mission replay, no New Game+</b> — but no trophy depends on how you play a mission, and free roam carries on after the credits, so every other trophy can be finished after the story (GTABase).</li>' +
    '<li><b>All 12 story trophies</b> (chapters 1–5 and the six named missions) pop from playing the story and cannot be missed.</li>' +
    '<li><b>Side quests stay open:</b> Andy, Kenton, Billy, Randy, Tyrone and Bret all finish after the story. Kenton disappears after Chapter 1 but texts Jason again later.</li>' +
    '<li><b>Cheats disable trophies and saving</b> — keep them off for the whole trophy run (PowerPyx, GTABase).</li>' +
    '<li><b>Do not push towards the Irredeemable criminal profile:</b> it is permanent (GTABase). Turn on Criminal Profile notifications in Settings > UI.</li>' +
    '<li><b>Five trophies are not pinned down yet:</b> In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There and Ten Pin — GTABase lists their exact steps as unconfirmed. Their guides say so honestly instead of guessing.</li>' +
    '</ul>';
  host.append(safe);
}
