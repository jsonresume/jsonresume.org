import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  relativeTime,
  Table,
  Td,
  Th,
} from '@jsonresume/ui';
import type { Overview } from '@repo/api';
import { country, duration, label } from '../format';

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
    <Card>
      <CardHeader>
        <CardTitle level={2}>Recent views</CardTitle>
      </CardHeader>
      <CardContent>
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
                <Td>
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
      </CardContent>
    </Card>
  );
}
