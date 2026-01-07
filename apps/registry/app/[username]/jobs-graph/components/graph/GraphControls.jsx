'use client';

import { Input } from '@repo/ui';
import { SalaryHistogramSlider } from '../SalaryHistogramSlider';

function TogglePill({ active, onClick, children, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
        transition-all duration-200 ease-out
        ${
          active
            ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md shadow-emerald-500/25'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
        }
      `}
    >
      {icon && <span className="text-sm">{icon}</span>}
      {children}
    </button>
  );
}

export function GraphControls({
  filterText,
  setFilterText,
  showSalaryGradient,
  setShowSalaryGradient,
  remoteOnly,
  setRemoteOnly,
  showHidden,
  setShowHidden,
  salaryRange,
}) {
  const hasSalaryData = salaryRange?.histogram?.length > 0;
  const jobsWithSalary = salaryRange?.salaries?.length || 0;

  return (
    <div className="relative">
      {/* Main controls bar */}
      <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          {/* Search input with icon */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <Input
              type="text"
              placeholder="Search jobs..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-10 bg-white/80 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20"
            />
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-slate-200" />

          {/* Toggle pills */}
          <div className="flex items-center gap-2">
            <TogglePill
              active={remoteOnly}
              onClick={() => setRemoteOnly(!remoteOnly)}
              icon="🌍"
            >
              Remote
            </TogglePill>

            <TogglePill
              active={showHidden}
              onClick={() => setShowHidden(!showHidden)}
              icon="👁"
            >
              Show Hidden
            </TogglePill>

            <TogglePill
              active={showSalaryGradient}
              onClick={() => setShowSalaryGradient(!showSalaryGradient)}
              icon="💰"
            >
              Salary
            </TogglePill>
          </div>

          {/* Stats badge */}
          {showSalaryGradient && (
            <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                {jobsWithSalary} jobs with salary
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Salary panel - slides down when enabled */}
      {showSalaryGradient && (
        <div className="px-4 py-4 bg-gradient-to-b from-slate-50/80 to-white border-b border-slate-200/60">
          {hasSalaryData ? (
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold text-slate-700">
                  Salary Distribution
                </h3>
                <span className="text-xs text-slate-400">
                  Drag handles to filter
                </span>
              </div>
              <SalaryHistogramSlider
                min={salaryRange.min}
                max={salaryRange.max}
                histogram={salaryRange.histogram}
                value={salaryRange.filterRange}
                onChange={salaryRange.setFilterRange}
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-slate-600">
                  No salary data available
                </p>
                <p className="text-xs text-slate-400">
                  Salary information not found for matched jobs
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
