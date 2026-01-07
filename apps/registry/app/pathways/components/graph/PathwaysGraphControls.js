import { X } from 'lucide-react';
import { Input, Checkbox, Button, Badge } from '@repo/ui';
import { SalaryHistogramSlider } from '@/app/[username]/jobs-graph/components/SalaryHistogramSlider';

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
    <div className="bg-white border-b">
      {/* Main controls bar */}
      <div className="px-4 py-2 flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xl">
          <Input
            type="text"
            placeholder="Filter jobs by title, company, skills..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pr-8"
          />
          {filterText && (
            <button
              type="button"
              onClick={() => setFilterText('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={remoteOnly} onCheckedChange={setRemoteOnly} />
            <span className="text-sm font-medium text-gray-700">Remote</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={hideFiltered}
              onCheckedChange={setHideFiltered}
            />
            <span className="text-sm font-medium text-gray-700">
              Hide Others
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={showSalaryGradient}
              onCheckedChange={setShowSalaryGradient}
            />
            <span className="text-sm font-medium text-gray-700">Salary</span>
          </label>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {showSalaryGradient && (
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
              {jobsWithSalary} with salary
            </span>
          )}
          <Badge variant="secondary" className="font-normal">
            {visibleJobs} / {totalJobs} jobs
          </Badge>

          {hasActiveFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs h-7"
            >
              <X className="w-3 h-3 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Salary histogram panel */}
      {showSalaryGradient && (
        <div className="px-4 py-3 bg-gray-50 border-t">
          {hasSalaryData ? (
            <div className="max-w-xl">
              <div className="text-xs text-gray-500 mb-2">
                Drag handles to filter by salary range
              </div>
              <SalaryHistogramSlider
                min={salaryRange.min}
                max={salaryRange.max}
                p5={salaryRange.p5}
                p95={salaryRange.p95}
                histogram={salaryRange.histogram}
                value={salaryRange.filterRange}
                onChange={salaryRange.setFilterRange}
              />
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              No salary data available for matched jobs
            </div>
          )}
        </div>
      )}
    </div>
  );
}
