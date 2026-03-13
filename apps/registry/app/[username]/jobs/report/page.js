'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import HeroSection from './components/HeroSection';
import PipelineChart from './components/PipelineChart';
import ActivityTimeline from './components/ActivityTimeline';
import SalaryChart from './components/SalaryChart';
import DealBreakers from './components/DealBreakers';
import SkillGaps from './components/SkillGaps';
import InsightsPanel from './components/InsightsPanel';
import RecentActivity from './components/RecentActivity';
import TopCompanies from './components/TopCompanies';

const DAY_OPTIONS = [7, 14, 30, 60, 90];

function LoadingSkeleton() {
  return (
    <div className="bg-slate-950 min-h-screen p-6 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-8 w-64 bg-slate-800 rounded" />
        <div className="grid grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-800/60 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-72 bg-slate-800/60 rounded-lg" />
          <div className="h-72 bg-slate-800/60 rounded-lg" />
        </div>
        <div className="h-80 bg-slate-800/60 rounded-lg" />
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="bg-slate-950 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-4xl mb-4">{'\u26A0\uFE0F'}</div>
        <h2 className="text-xl font-semibold text-slate-200 mb-2">
          Unable to load report
        </h2>
        <p className="text-slate-400 text-sm mb-6">{message}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200
                     rounded-lg text-sm transition-colors border border-slate-600"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export default function ReportPage() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/report/${username}?days=${days}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      setData(await res.json());
    } catch (err) {
      setError(err.message || 'Failed to load report');
    } finally {
      setLoading(false);
    }
  }, [username, days]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} onRetry={fetchReport} />;
  if (!data) return null;

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div />
          <DaysSelector days={days} onChange={setDays} />
        </div>
        <HeroSection
          pipeline={data.pipeline}
          username={data.username}
          days={data.days}
          momentum={data.momentum}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <PipelineChart pipeline={data.pipeline} />
          <InsightsPanel
            momentum={data.momentum}
            remoteIndex={data.remoteIndex}
            secondLook={data.secondLook}
          />
        </div>
        <div className="mb-4">
          <ActivityTimeline timeline={data.timeline} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <SalaryChart salary={data.salary} />
          <DealBreakers dealBreakers={data.dealBreakers} />
        </div>
        <div className="mb-4">
          <SkillGaps skills={data.skills} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopCompanies topCompanies={data.topCompanies} />
          <RecentActivity recentActivity={data.recentActivity} />
        </div>
        <footer className="mt-12 pb-8 text-center text-xs text-slate-600">
          Generated {new Date(data.generatedAt).toLocaleString()} &middot; JSON
          Resume
        </footer>
      </div>
    </div>
  );
}

function DaysSelector({ days, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-0.5 border border-slate-700/50">
      {DAY_OPTIONS.map((d) => (
        <button
          key={d}
          onClick={() => onChange(d)}
          className={`px-3 py-1.5 text-xs rounded-md transition-all ${
            days === d
              ? 'bg-slate-700 text-white font-medium shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {d}d
        </button>
      ))}
    </div>
  );
}
