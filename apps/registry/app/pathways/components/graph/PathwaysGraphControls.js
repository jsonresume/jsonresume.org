import { Input, Checkbox } from '@repo/ui';

export function PathwaysGraphControls({
  filterText,
  setFilterText,
  showSalaryGradient,
  setShowSalaryGradient,
  remoteOnly,
  setRemoteOnly,
  hideFiltered,
  setHideFiltered,
}) {
  return (
    <div className="px-4 py-2 bg-white border-b flex items-center gap-4 flex-wrap">
      <Input
        type="text"
        placeholder="Filter jobs by title, company, skills..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="flex-1 min-w-[200px] max-w-xl"
      />
      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox checked={remoteOnly} onCheckedChange={setRemoteOnly} />
        <span className="text-sm font-medium text-gray-900">Remote Only</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox checked={hideFiltered} onCheckedChange={setHideFiltered} />
        <span className="text-sm font-medium text-gray-900">Hide Filtered</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox
          checked={showSalaryGradient}
          onCheckedChange={setShowSalaryGradient}
        />
        <span className="text-sm font-medium text-gray-900">Salary View</span>
      </label>
    </div>
  );
}
