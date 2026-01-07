import { Search, X, Globe, EyeOff, DollarSign } from 'lucide-react';
import { Input, Button } from '@repo/ui';
import { SalaryHistogramSlider } from '@/app/[username]/jobs-graph/components/SalaryHistogramSlider';

function FilterPill({ active, onClick, children, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
        transition-all duration-200 ease-out select-none
        ${
          active
            ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25 scale-[1.02]'
            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
        }
      `}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </button>
  );
}

function StatBadge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-slate-100 text-slate-600',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    accent: 'bg-violet-50 text-violet-700 border border-violet-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

export function PathwaysGraphControls({
  filterText,
  setFilterText,
  showSalaryGradient,
  setShowSalaryGradient,
  remoteOnly,
  setRemoteOnly,
  hideFiltered,
  setHideFiltered,
  totalJobs = 0,
  visibleJobs = 0,
  hasActiveFilter = false,
  onClearFilters,
  salaryRange,
}) {
  const hasSalaryData = salaryRange?.histogram?.length > 0;
  const jobsWithSalary = salaryRange?.salaries?.length || 0;

  return (
    <div className="bg-gradient-to-b from-white to-slate-50/50 border-b border-slate-200/80">
      {/* Main controls bar */}
      <div className="px-4 py-3 flex items-center gap-4 flex-wrap">
        {/* Search input */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search jobs..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-9 pr-8 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-violet-400 focus:ring-violet-400/20 rounded-lg"
          />
          {filterText && (
            <button
              type="button"
              onClick={() => setFilterText('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2">
          <FilterPill
            active={remoteOnly}
            onClick={() => setRemoteOnly(!remoteOnly)}
            icon={Globe}
          >
            Remote
          </FilterPill>

          <FilterPill
            active={hideFiltered}
            onClick={() => setHideFiltered(!hideFiltered)}
            icon={EyeOff}
          >
            Hide Others
          </FilterPill>

          <FilterPill
            active={showSalaryGradient}
            onClick={() => setShowSalaryGradient(!showSalaryGradient)}
            icon={DollarSign}
          >
            Salary
          </FilterPill>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2 ml-auto">
          {showSalaryGradient && jobsWithSalary > 0 && (
            <StatBadge variant="success">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
              {jobsWithSalary} with salary
            </StatBadge>
          )}

          <StatBadge variant={visibleJobs < totalJobs ? 'accent' : 'default'}>
            {visibleJobs} / {totalJobs}
          </StatBadge>

          {hasActiveFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs h-7 text-slate-500 hover:text-slate-700"
            >
              <X className="w-3 h-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Salary histogram panel - compact, full width */}
      {showSalaryGradient && (
        <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100">
          {hasSalaryData ? (
            <SalaryHistogramSlider
              min={salaryRange.min}
              max={salaryRange.max}
              p5={salaryRange.p5}
              p95={salaryRange.p95}
              histogram={salaryRange.histogram}
              value={salaryRange.filterRange}
              onChange={salaryRange.setFilterRange}
              compact
            />
          ) : (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <DollarSign className="w-4 h-4" />
              No salary data available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
