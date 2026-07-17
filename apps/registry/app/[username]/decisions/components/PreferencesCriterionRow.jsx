/**
 * PreferencesCriterionRow — a single evaluation criterion row: toggle switch
 * plus the range/number value controls when enabled.
 */

'use client';

function RangeControls({ criterion, pref, onValueChange, max, step, format }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-700">
        <span>Min: {format(pref.value.min || 0)}</span>
        <span>Max: {format(pref.value.max || 0)}</span>
      </div>
      <div className="space-y-1">
        <input
          type="range"
          min="0"
          max={max}
          step={step}
          value={pref.value.min || 0}
          onChange={(e) =>
            onValueChange(criterion.id, {
              ...pref.value,
              min: parseInt(e.target.value),
            })
          }
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <input
          type="range"
          min="0"
          max={max}
          step={step}
          value={pref.value.max || 0}
          onChange={(e) =>
            onValueChange(criterion.id, {
              ...pref.value,
              max: parseInt(e.target.value),
            })
          }
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>
    </div>
  );
}

export function PreferencesCriterionRow({
  criterion,
  pref,
  onToggle,
  onValueChange,
}) {
  return (
    <div
      className={`p-3 rounded-lg border transition ${
        pref.enabled
          ? 'bg-blue-50 border-blue-200'
          : 'bg-slate-50 border-slate-200'
      }`}
    >
      {/* Toggle Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{criterion.icon}</span>
          <span
            className={`text-sm font-medium ${
              pref.enabled ? 'text-slate-900' : 'text-slate-500'
            }`}
          >
            {criterion.label}
          </span>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={() => onToggle(criterion.id)}
          className={`relative w-11 h-6 rounded-full transition ${
            pref.enabled ? 'bg-blue-500' : 'bg-slate-300'
          }`}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
              pref.enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Value Controls */}
      {pref.enabled && criterion.type === 'range' && (
        <RangeControls
          criterion={criterion}
          pref={pref}
          onValueChange={onValueChange}
          max="300000"
          step="5000"
          format={(v) => `$${(v || 0).toLocaleString()}`}
        />
      )}

      {pref.enabled && criterion.type === 'number' && (
        <RangeControls
          criterion={criterion}
          pref={pref}
          onValueChange={onValueChange}
          max="30"
          step="1"
          format={(v) => `${v || 0} years`}
        />
      )}
    </div>
  );
}
