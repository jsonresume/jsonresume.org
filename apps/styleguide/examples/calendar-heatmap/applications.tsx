import { CalendarHeatmap } from '@jsonresume/ui';

// Deterministic sample data: a busier stretch in the last month.
const end = new Date('2026-10-23T00:00:00Z');
const data: Record<string, number> = {};
for (let i = 0; i < 182; i++) {
  const d = new Date(end);
  d.setUTCDate(d.getUTCDate() - i);
  const n = (i * 7919) % 11;
  if (n > 6 || (i < 30 && n > 3)) data[d.toISOString().slice(0, 10)] = n - 3;
}

export default function CalendarHeatmapApplications() {
  return (
    <CalendarHeatmap
      label="Applications sent"
      data={data}
      end={end}
      formatCount={(n) => `${n} applications`}
    />
  );
}
