import { Input, Checkbox } from '@repo/ui';

export function GraphControls({
  filterText,
  setFilterText,
  showSalaryGradient,
  setShowSalaryGradient,
}) {
  return (
    <div className="px-4 py-2 bg-white border-b flex items-center gap-4">
      <Input
        type="text"
        placeholder="Filter jobs by title, company, skills..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="flex-1 max-w-xl"
      />
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
