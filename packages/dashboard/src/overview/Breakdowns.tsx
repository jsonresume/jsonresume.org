import { BarList } from '@jsonresume/ui';
import type { Overview } from '@repo/api';
import { count, country, label } from '../format';
import * as s from '../dashboard.css';

type Rows = Overview['referrers'];

const items = (
  rows: Rows,
  name: (l: string) => string = (l) => l,
  link?: (l: string) => string | undefined
) =>
  rows.map((r) => {
    const href = link?.(r.label);
    return { label: name(r.label), value: r.value, ...(href ? { href } : {}) };
  });

/** Where views came from and on what, one ranked list each. */
export function Breakdowns({ overview }: { overview: Overview }) {
  const lists = [
    {
      title: 'Sources',
      item: 'Source',
      rows: items(overview.referrers, undefined, (l) =>
        l === 'Direct' ? undefined : `https://${l}`
      ),
    },
    {
      title: 'Countries',
      item: 'Country',
      rows: items(overview.countries, country),
    },
    { title: 'Devices', item: 'Device', rows: items(overview.devices, label) },
    { title: 'Browsers', item: 'Browser', rows: items(overview.browsers) },
    { title: 'Themes', item: 'Theme', rows: items(overview.themes) },
  ];
  return (
    <div className={s.breakdowns}>
      {lists.map((list) => (
        <section key={list.title} className={s.panel}>
          <BarList
            title={list.title}
            itemLabel={list.item}
            items={list.rows}
            valueLabel="Views"
            formatValue={count}
            emptyLabel="No views in this range"
          />
        </section>
      ))}
    </div>
  );
}
