'use client';

import { useDashboardData } from './DashboardModule/hooks/useDashboardData';
import { LoadingState } from './DashboardModule/components/LoadingState';
import { ErrorState } from './DashboardModule/components/ErrorState';
import { EmptyState } from './DashboardModule/components/EmptyState';
import { SummaryCard } from './DashboardModule/components/SummaryCard';
import { OverviewCard } from './DashboardModule/components/OverviewCard';
import { EducationCard } from './DashboardModule/components/EducationCard';
import { StatsCard } from './DashboardModule/components/StatsCard';
import { SkillsCard } from './DashboardModule/components/SkillsCard';
import { CareerProgressionCard } from './DashboardModule/components/CareerProgressionCard';
import { CacheRefreshButton } from './DashboardModule/components/CacheRefreshButton';

const ResumeDashboard = () => {
  const { resume, metrics, loading, error } = useDashboardData();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!resume) {
    return <EmptyState />;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="">
        <div className="mb-6 flex justify-end">
          <CacheRefreshButton />
        </div>

        <SummaryCard summary={resume.basics?.summary} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <OverviewCard metrics={metrics} />
          <EducationCard educationLevel={metrics.educationLevel} />
          <StatsCard metrics={metrics} />
        </div>

        <SkillsCard skills={resume.skills} />

        <CareerProgressionCard careerProgression={metrics.careerProgression} />
      </div>
    </div>
  );
};

export default ResumeDashboard;
