import { X } from 'lucide-react';
import { Input, Checkbox, Button, Badge } from '@repo/ui';

function SalaryLegend() {
  return (
    <div className="flex items-center gap-1 text-xs text-gray-500">
      <span>$</span>
      <div className="flex h-3 w-20 rounded overflow-hidden">
        <div className="flex-1 bg-red-400" />
        <div className="flex-1 bg-orange-400" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-green-400" />
        <div className="flex-1 bg-emerald-500" />
      </div>
      <span>$$$</span>
    </div>
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
}) {
  return (
    <div className="px-4 py-2 bg-white border-b flex items-center gap-4 flex-wrap">
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
          <Checkbox checked={hideFiltered} onCheckedChange={setHideFiltered} />
          <span className="text-sm font-medium text-gray-700">Hide Others</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={showSalaryGradient}
            onCheckedChange={setShowSalaryGradient}
          />
          <span className="text-sm font-medium text-gray-700">Salary</span>
        </label>
      </div>

      {showSalaryGradient && <SalaryLegend />}

      <div className="flex items-center gap-2 ml-auto">
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
  );
}
