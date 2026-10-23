import { relativeTime, Table, Td, Th } from '@jsonresume/ui';
import type { Overview } from '@repo/api';
import { country, duration, label } from '../format';
import * as s from '../dashboard.css';

const kinds = {
  page: 'Page',
  json: 'JSON',
  yaml: 'YAML',
  txt: 'Text',
} as const;

/** The latest views, newest first. */
export function RecentViews({ overview }: { overview: Overview }) {
  if (overview.recent.length === 0) return null;
  return (
    <section className={s.panel} aria-labelledby="recent-title">
      <h2 id="recent-title" className={s.panelTitle}>
        Recent views
      </h2>
      <div className={s.tableWrap}>
        <Table>
          <thead>
            <tr>
              <Th>When</Th>
              <Th>As</Th>
              <Th>From</Th>
              <Th>Where</Th>
              <Th>Device</Th>
              <Th>Read for</Th>
            </tr>
          </thead>
          <tbody>
            {overview.recent.map((view) => (
              <tr key={view.viewedAt + view.kind + (view.referrer ?? '')}>
                <Td className={s.nowrap}>
                  <time
                    dateTime={view.viewedAt}
                    title={new Date(view.viewedAt).toLocaleString()}
                  >
                    {relativeTime(new Date(view.viewedAt), new Date())}
                  </time>
                </Td>
                <Td>{kinds[view.kind]}</Td>
                <Td>{view.referrer ?? 'Direct'}</Td>
                <Td>{view.country ? country(view.country) : '—'}</Td>
                <Td>
                  {[view.device && label(view.device), view.browser]
                    .filter(Boolean)
                    .join(' · ') || '—'}
                </Td>
                <Td>
                  {view.kind === 'page' && view.seconds > 0
                    ? duration(view.seconds)
                    : '—'}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </section>
  );
}
