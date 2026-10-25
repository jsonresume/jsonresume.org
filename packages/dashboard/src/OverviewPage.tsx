import { useAtom, useAtomValue } from '@effect/atom-react';
import {
  AppPage,
  Button,
  Card,
  CardContent,
  EmptyState,
  SegmentedControl,
  Stack,
  TimeSeriesChart,
} from '@jsonresume/ui';
import { AnalyticsRange, type Overview } from '@repo/api';
import { overviewAtom } from '@repo/api-client';
import { optionParam, useAtomsInUrl } from '@repo/url-state';
import { Schema } from 'effect';
import { Atom, AsyncResult } from 'effect/reactivity';
import { useRef } from 'react';
import { count, rangeDays } from './format';
import { Notices } from './Notices';
import { Breakdowns } from './overview/Breakdowns';
import { GetStarted } from './overview/GetStarted';
import { Kpis } from './overview/Kpis';
import { RecentViews } from './overview/RecentViews';
import { useSession } from './session';

/** ?range=7d|30d|90d; 30 days when absent or unknown. */
export const rangeParamAtom = Atom.make<string | null>(null);
const isRange = Schema.is(AnalyticsRange);
const bindings = [optionParam('range', rangeParamAtom)];
const ranges = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
];

function summary(overview: Overview) {
  const busiest = overview.daily.reduce(
    (a, b) => (b.views > a.views ? b : a),
    overview.daily[0] ?? { date: '', views: 0 }
  );
  const days = rangeDays[overview.range];
  return busiest.views > 0
    ? `${count(
        overview.totals.views
      )} views over the last ${days} days, most on ${busiest.date} (${count(
        busiest.views
      )}).`
    : `No views over the last ${days} days.`;
}

function Report({
  overview,
  loading,
}: {
  overview: Overview;
  loading: boolean;
}) {
  const { username } = useSession();
  const url = `${location.origin}/@${username}`;
  if (overview.totals.views === 0 && overview.totals.dataReads === 0) {
    return <GetStarted url={url} />;
  }
  return (
    <Stack gap={6}>
      <Kpis overview={overview} />
      <Card>
        <CardContent>
          <TimeSeriesChart
            title="Views and visitors per day"
            summary={summary(overview)}
            data={overview.daily.map((d) => ({
              date: d.date,
              values: { views: d.views, visitors: d.visitors },
            }))}
            series={[
              { key: 'views', label: 'Views' },
              { key: 'visitors', label: 'Visitors', mark: 'line' },
            ]}
            loading={loading}
          />
        </CardContent>
      </Card>
      <Breakdowns overview={overview} />
      <RecentViews overview={overview} />
    </Stack>
  );
}

/** Who reads the resume: totals, a chart per day, sources and recent views. */
export function OverviewPage() {
  useAtomsInUrl(bindings);
  const { username } = useSession();
  const [param, setParam] = useAtom(rangeParamAtom);
  const range = param !== null && isRange(param) ? param : '30d';
  const result = useAtomValue(overviewAtom(range));
  // Changing the range keeps the last report on screen, dimmed, until the new one arrives.
  const last = useRef<Overview | null>(null);
  if (AsyncResult.isSuccess(result)) last.current = result.value;
  const shown = last.current;

  return (
    <AppPage
      title="Overview"
      description={`How people read @${username}.`}
      actions={
        <Button asChild variant="secondary" size="sm">
          <a href={`/@${username}`}>View your page</a>
        </Button>
      }
      toolbar={
        <SegmentedControl
          label="Range"
          options={ranges}
          value={range}
          onValueChange={(value) => setParam(value === '30d' ? null : value)}
        />
      }
    >
      <Stack gap={6}>
        <Notices />
        {shown ? (
          <Report
            overview={shown}
            loading={!AsyncResult.isSuccess(result) || shown.range !== range}
          />
        ) : AsyncResult.isFailure(result) ? (
          <EmptyState title="Couldn’t load your views">
            Refresh to try again.
          </EmptyState>
        ) : null}
      </Stack>
    </AppPage>
  );
}
