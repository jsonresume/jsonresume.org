/** A scored item with what the person actually decided. */
export interface Labeled {
  score: number;
  /** True for a job they wanted (saved or applied), false for one they passed on. */
  liked: boolean;
}

/**
 * The chance a job they wanted scores above one they passed on (ROC AUC):
 * 0.5 is a coin flip, 1 a perfect order. Ties count half.
 */
export const auc = (items: ReadonlyArray<Labeled>) => {
  const pos = items.filter((i) => i.liked).map((i) => i.score);
  const neg = items.filter((i) => !i.liked).map((i) => i.score);
  if (pos.length === 0 || neg.length === 0) return null;
  let wins = 0;
  for (const p of pos) {
    for (const n of neg) wins += p > n ? 1 : p === n ? 0.5 : 0;
  }
  return wins / (pos.length * neg.length);
};

/** Of the k best-scored, the share they wanted. */
export const precisionAt = (items: ReadonlyArray<Labeled>, k: number) => {
  const top = [...items].sort((a, b) => b.score - a.score).slice(0, k);
  return top.length === 0
    ? null
    : top.filter((i) => i.liked).length / top.length;
};
