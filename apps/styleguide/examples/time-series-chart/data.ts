/** Thirty days of resume views, shared by the chart and dashboard examples. */
const views = [
  12, 18, 15, 22, 19, 9, 8, 25, 31, 28, 24, 30, 14, 12, 33, 41, 38, 35, 44, 20,
  18, 47, 52, 49, 58, 54, 26, 22, 61, 68,
];

export const resumeViews = views.map((count, i) => ({
  date: new Date(Date.UTC(2026, 8, 24 + i)).toISOString().slice(0, 10),
  values: { views: count, visitors: Math.round(count * 0.72) },
}));
