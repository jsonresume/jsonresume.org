import { Input, Checkbox } from '@repo/ui';
import { SalaryHistogramSlider } from '../SalaryHistogramSlider';

export function GraphControls({
  filterText,
  setFilterText,
  showSalaryGradient,
  setShowSalaryGradient,
  remoteOnly,
  setRemoteOnly,
  hideFiltered,
  setHideFiltered,
  salaryRange,
}) {
  const hasSalaryData = salaryRange?.histogram?.length > 0;

  return (
    <div className="px-4 py-2 bg-white border-b">
      <div className="flex items-center gap-4">
        <Input
          type="text"
          placeholder="Filter jobs by title, company, skills..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="flex-1 max-w-xl"
        />
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox checked={remoteOnly} onCheckedChange={setRemoteOnly} />
          <span className="text-sm font-medium text-gray-900">Remote Only</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox checked={hideFiltered} onCheckedChange={setHideFiltered} />
          <span className="text-sm font-medium text-gray-900">
            Hide Filtered
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={showSalaryGradient}
            onCheckedChange={setShowSalaryGradient}
          />
          <span className="text-sm font-medium text-gray-900">Salary View</span>
        </label>
      </div>

      {/* Salary histogram slider - shown when salary view is enabled */}
      {showSalaryGradient && hasSalaryData && (
        <div className="mt-3 max-w-2xl">
          <SalaryHistogramSlider
            min={salaryRange.min}
            max={salaryRange.max}
            histogram={salaryRange.histogram}
            value={salaryRange.filterRange}
            onChange={salaryRange.setFilterRange}
          />
        </div>
      )}
    </div>
  );
}
