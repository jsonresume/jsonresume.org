export function GraphControls({
  filterText,
  setFilterText,
  showSalaryGradient,
  setShowSalaryGradient,
}) {
  return (
    <div className="px-4 py-2 bg-white border-b flex items-center gap-4">
      <input
        type="text"
        placeholder="Filter jobs by title, company, skills..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="flex-1 max-w-xl px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={showSalaryGradient}
          onChange={(e) => setShowSalaryGradient(e.target.checked)}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        <span className="ml-2 text-sm font-medium text-gray-900">
          Salary View
        </span>
      </label>
    </div>
  );
}
