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
  docx: 'Word',
} as const;

/** The latest page views, or downloads, newest first. */
export function RecentViews({
  overview,
  downloads = false,
}: {
  overview: Overview;
  downloads?: boolean;
}) {
  const rows = downloads ? overview.recentDownloads : overview.recent;
  if (rows.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle level={2}>
          {downloads ? 'Recent downloads' : 'Recent views'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <thead>
            <tr>
              <Th>When</Th>
              <Th>As</Th>
              <Th>From</Th>
              <Th>Where</Th>
              <Th>{downloads ? 'By' : 'Device'}</Th>
              {downloads ? null : <Th>Read for</Th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((view) => (
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
                  {(downloads
                    ? view.browser
                    : [view.device && label(view.device), view.browser]
                        .filter(Boolean)
                        .join(' · ')) || '—'}
                </Td>
                {downloads ? null : (
                  <Td>{view.seconds > 0 ? duration(view.seconds) : '—'}</Td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </CardContent>
    </Card>
  );
}
