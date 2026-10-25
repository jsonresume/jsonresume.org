'use client';

import {
  AccountMenu,
  AppNav,
  AppPage,
  AppShell,
  BarList,
  Button,
  DropdownMenuItem,
  Grid,
  Logo,
  SegmentedControl,
  StatTile,
  TimeSeriesChart,
} from '@jsonresume/ui';
import { BarChart3, FileJson, Settings } from 'lucide-react';
import { resumeViews } from '../time-series-chart/data';
import * as styles from './dashboard.css';

export default function AppShellDashboard() {
  return (
    <AppShell
      className={styles.frame}
      brand={<Logo />}
      nav={
        <AppNav
          label="Dashboard"
          items={[
            {
              label: 'Overview',
              href: '#',
              icon: <BarChart3 size={16} />,
              current: true,
            },
            { label: 'Resume', href: '#', icon: <FileJson size={16} /> },
            { label: 'Settings', href: '#', icon: <Settings size={16} /> },
          ]}
        />
      }
      top={
        <AccountMenu
          name="Thomas Davis"
          email="thomas@example.com"
          onSignOut={() => {}}
        >
          <DropdownMenuItem>View my resume</DropdownMenuItem>
        </AccountMenu>
      }
    >
      <AppPage
        title="Overview"
        description="Who reads jsonresume.org/@thomasdavis"
        actions={<Button size="sm">View resume</Button>}
        toolbar={
          <SegmentedControl
            label="Period"
            defaultValue="30d"
            options={[
              { value: '7d', label: '7 days' },
              { value: '30d', label: '30 days' },
              { value: '90d', label: '90 days' },
            ]}
          />
        }
      >
        <Grid minColumnWidth="12rem" gap={4}>
          <StatTile
            label="Views"
            value="1,284"
            delta={{ value: 0.24, label: 'vs previous 30 days' }}
          />
          <StatTile
            label="Visitors"
            value="903"
            delta={{ value: 0.18, label: 'vs previous 30 days' }}
          />
          <StatTile label="Median time on page" value="1m 12s" />
        </Grid>
        <div className={styles.card}>
          <TimeSeriesChart
            title="Views and visitors"
            summary="Views rose from 12 to 68 a day over 30 days."
            data={resumeViews}
            series={[
              { key: 'views', label: 'Views' },
              { key: 'visitors', label: 'Visitors' },
            ]}
          />
        </div>
        <div className={styles.panels}>
          <div className={styles.card}>
            <BarList
              title="Top sources"
              itemLabel="Source"
              valueLabel="Views"
              items={[
                { label: 'Direct', value: 412 },
                { label: 'linkedin.com', value: 236 },
                { label: 'github.com', value: 118 },
              ]}
            />
          </div>
          <div className={styles.card}>
            <BarList
              title="Devices"
              itemLabel="Device"
              valueLabel="Visitors"
              items={[
                { label: 'Desktop', value: 611 },
                { label: 'Mobile', value: 262 },
                { label: 'Tablet', value: 30 },
              ]}
            />
          </div>
        </div>
      </AppPage>
    </AppShell>
  );
}
