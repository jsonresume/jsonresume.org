'use client';

/** State + remote filter controls for the My Jobs page. */
export function Filters({ filters, onChange }) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <select
        value={filters.stateFilter}
        onChange={(e) => onChange({ ...filters, stateFilter: e.target.value })}
        className="px-3 py-1.5 border rounded-md text-sm bg-white"
      >
        <option value="all">All states</option>
        <option value="interested">Interested</option>
        <option value="applied">Applied</option>
        <option value="maybe">Maybe</option>
        <option value="unmarked">Unmarked</option>
      </select>
      <label className="flex items-center gap-1.5 text-sm">
        <input
          type="checkbox"
          checked={filters.remote}
          onChange={(e) => onChange({ ...filters, remote: e.target.checked })}
          className="rounded"
        />
        Remote only
      </label>
    </div>
  );
}
