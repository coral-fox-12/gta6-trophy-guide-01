// Progress store: earned trophies + spoiler setting, kept in localStorage, with
// export to a JSON file and import back. Nothing leaves the browser except
// through an export the reader asks for.
export const EARNED_KEY = 'gta6-trophy-tracker-earned-v1';
export const SPOILER_KEY = 'gta6-trophy-tracker-spoiler-v1';

export function loadEarned() {
  try {
    const raw = localStorage.getItem(EARNED_KEY);
    if (!raw) return new Set();
    const ids = JSON.parse(raw);
    return new Set(Array.isArray(ids) ? ids.filter((n) => Number.isInteger(n)) : []);
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(EARNED_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

export function loadSpoilerHidden() {
  return localStorage.getItem(SPOILER_KEY) !== 'off';
}

export function saveSpoilerHidden(hidden) {
  localStorage.setItem(SPOILER_KEY, hidden ? 'on' : 'off');
}

export function exportProgress(earned, total) {
  const payload = {
    app: 'Leonida Platinum — GTA 6 Trophy Guide & Tracker',
    exported_at: new Date().toISOString(),
    total,
    earned: [...earned].sort((a, b) => a - b),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gta6-trophy-progress.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

export async function importProgressFile(file, validIds) {
  const text = await file.text();
  const data = JSON.parse(text);
  const ids = Array.isArray(data) ? data : data.earned;
  if (!Array.isArray(ids)) throw new Error('no earned list in file');
  const kept = ids.filter((n) => validIds.has(n));
  return new Set(kept);
}
