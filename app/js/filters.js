// Filtering and the spoiler rule: which trophies the list shows, and which of
// them stay masked until earned.
export const KIND_LABELS = {
  story: 'Story',
  sidequest: 'Side quests',
  collectible: 'Collectibles',
  activity: 'Activities',
  challenge: 'Challenges',
  robbery: 'Robberies',
  exploration: 'Exploration',
  misc: 'Miscellaneous',
  platinum: 'Platinum',
};

export function isSpoilerMasked(trophy, spoilerHidden, earned) {
  return spoilerHidden && trophy.hidden && !earned.has(trophy.id);
}

export function filterTrophies(trophies, filters, earned) {
  const q = filters.query.trim().toLowerCase();
  return trophies.filter((t) => {
    if (filters.kind === 'missable') {
      if (!t.missable) return false;
    } else if (filters.kind !== 'all' && t.kind !== filters.kind) {
      return false;
    }
    if (filters.grade !== 'all' && t.grade !== filters.grade) return false;
    if (filters.status === 'earned' && !earned.has(t.id)) return false;
    if (filters.status === 'unearned' && earned.has(t.id)) return false;
    if (q) {
      const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function gradeCounts(trophies, earned) {
  const counts = { platinum: [0, 0], gold: [0, 0], silver: [0, 0], bronze: [0, 0] };
  for (const t of trophies) {
    counts[t.grade][1] += 1;
    if (earned.has(t.id)) counts[t.grade][0] += 1;
  }
  return counts;
}
