'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';

/**
 * Format salary for display (e.g., $100k, $1.5M)
 */
function formatSalary(value) {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  return `$${Math.round(value / 1000)}k`;
}

/**
 * Modern salary histogram slider with bar chart
 */
export function SalaryHistogramSlider({
  min,
  max,
  p5,
  p95,
  histogram,
  value,
  onChange,
  className = '',
  compact = false,
}) {
  const [isDragging, setIsDragging] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);
  const sliderRef = useRef(null);

  // Use percentile range to exclude outliers
  const displayMin = p5 ?? min;
  const displayMax = p95 ?? max;

  // Current range values
  const rangeMin = value?.min ?? displayMin;
  const rangeMax = value?.max ?? displayMax;

  // Calculate positions as percentages
  const minPercent =
    ((rangeMin - displayMin) / (displayMax - displayMin)) * 100 || 0;
  const maxPercent =
    ((rangeMax - displayMin) / (displayMax - displayMin)) * 100 || 100;

  // Find max count for histogram scaling
  const maxCount = useMemo(() => {
    return Math.max(...histogram.map((h) => h.count), 1);
  }, [histogram]);

  // Convert position to value
  const positionToValue = useCallback(
    (clientX) => {
      if (!sliderRef.current) return displayMin;
      const rect = sliderRef.current.getBoundingClientRect();
      const percent = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width)
      );
      const value = displayMin + percent * (displayMax - displayMin);
      return Math.round(value / 5000) * 5000;
    },
    [displayMin, displayMax]
  );

  const handlePointerDown = useCallback((e, handle) => {
    e.preventDefault();
    setIsDragging(handle);
  }, []);

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging) return;
      const newValue = positionToValue(e.clientX);

      if (isDragging === 'min') {
        onChange(Math.min(newValue, rangeMax - 5000), rangeMax);
      } else {
        onChange(rangeMin, Math.max(newValue, rangeMin + 5000));
      }
    },
    [isDragging, positionToValue, onChange, rangeMin, rangeMax]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  const isBarInRange = useCallback(
    (bar) => bar.max >= rangeMin && bar.min <= rangeMax,
    [rangeMin, rangeMax]
  );

  if (displayMax <= displayMin || histogram.length === 0) {
    return null;
  }

  // Histogram is already built from p5-p95 range, use directly
  const visibleHistogram = histogram;

  const quickRanges = [
    { label: 'All', min: displayMin, max: displayMax },
    { label: '<$100k', min: displayMin, max: 100000 },
    { label: '$100-200k', min: 100000, max: 200000 },
    { label: '$200k+', min: 200000, max: displayMax },
  ];

  return (
    <div className={`${className}`}>
      {/* Compact: single row with histogram, slider, and labels */}
      {compact ? (
        <div className="flex items-center gap-4">
          {/* Range label - min */}
          <span className="text-xs font-medium text-slate-600 w-14 text-right">
            {formatSalary(rangeMin)}
          </span>

          {/* Histogram + Slider container */}
          <div className="flex-1 min-w-0">
            {/* Histogram bars */}
            <div className="h-8 flex items-end gap-px mb-1">
              {visibleHistogram.map((bar, index) => {
                const height = (bar.count / maxCount) * 100;
                const inRange = isBarInRange(bar);
                const isHovered = hoveredBar === index;

                return (
                  <div
                    key={index}
                    className="flex-1 relative cursor-pointer flex items-end"
                    style={{ height: '100%' }}
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <div
                      className={`w-full rounded-sm transition-colors ${
                        inRange ? 'bg-violet-400' : 'bg-slate-300'
                      } ${isHovered ? 'bg-violet-500' : ''}`}
                      style={{ height: `${Math.max(height, 10)}%` }}
                    />
                    {isHovered && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-slate-800 text-white text-[10px] rounded shadow-lg whitespace-nowrap z-10">
                        {formatSalary(bar.min)}-{formatSalary(bar.max)}:{' '}
                        {bar.count}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Slider track */}
            <div
              ref={sliderRef}
              className="relative h-1.5 bg-slate-200 rounded-full cursor-pointer"
            >
              <div
                className="absolute h-full bg-violet-500 rounded-full"
                style={{
                  left: `${minPercent}%`,
                  width: `${maxPercent - minPercent}%`,
                }}
              />
              <div
                className={`absolute w-4 h-4 bg-white rounded-full -top-[5px] -translate-x-1/2 border-2 border-violet-500 shadow cursor-grab active:cursor-grabbing ${
                  isDragging === 'min' ? 'scale-110' : ''
                }`}
                style={{ left: `${minPercent}%` }}
                onPointerDown={(e) => handlePointerDown(e, 'min')}
              />
              <div
                className={`absolute w-4 h-4 bg-white rounded-full -top-[5px] -translate-x-1/2 border-2 border-violet-500 shadow cursor-grab active:cursor-grabbing ${
                  isDragging === 'max' ? 'scale-110' : ''
                }`}
                style={{ left: `${maxPercent}%` }}
                onPointerDown={(e) => handlePointerDown(e, 'max')}
              />
            </div>
          </div>

          {/* Range label - max */}
          <span className="text-xs font-medium text-slate-600 w-14">
            {formatSalary(rangeMax)}
          </span>

          {/* Quick range buttons - compact */}
          <div className="flex gap-1">
            {quickRanges.map((range) => {
              const isActive = rangeMin === range.min && rangeMax === range.max;
              return (
                <button
                  key={range.label}
                  type="button"
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                    isActive
                      ? 'bg-violet-100 text-violet-700'
                      : 'bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                  onClick={() => onChange(range.min, range.max)}
                >
                  {range.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Full layout - original design */
        <>
          {/* Range labels */}
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-sm font-semibold text-slate-700">
              {formatSalary(rangeMin)}
            </span>
            <span className="text-xs text-slate-400">
              {rangeMin === displayMin && rangeMax === displayMax
                ? 'Full range'
                : 'Filtered'}
            </span>
            <span className="text-sm font-semibold text-slate-700">
              {formatSalary(rangeMax)}
            </span>
          </div>

          {/* Histogram bars */}
          <div className="relative h-12 mb-2">
            <div className="absolute inset-0 flex items-end gap-[2px]">
              {visibleHistogram.map((bar, index) => {
                const height = (bar.count / maxCount) * 100;
                const inRange = isBarInRange(bar);
                const isHovered = hoveredBar === index;

                return (
                  <div
                    key={index}
                    className="flex-1 relative group cursor-pointer"
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <div
                      className={`w-full rounded-t transition-all duration-150 ${
                        inRange
                          ? 'bg-gradient-to-t from-violet-500 to-violet-400'
                          : 'bg-slate-200'
                      } ${isHovered ? 'opacity-80' : 'opacity-100'}`}
                      style={{ height: `${Math.max(height, 8)}%` }}
                    />
                    {isHovered && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-10">
                        {formatSalary(bar.min)} - {formatSalary(bar.max)}
                        <br />
                        <span className="text-slate-300">{bar.count} jobs</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Slider track */}
          <div
            ref={sliderRef}
            className="relative h-2 bg-slate-200 rounded-full cursor-pointer"
          >
            <div
              className="absolute h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
              style={{
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`,
              }}
            />
            <div
              className={`absolute w-5 h-5 bg-white rounded-full -top-1.5 -translate-x-1/2 border-2 border-violet-500 shadow-md cursor-grab active:cursor-grabbing transition-transform hover:scale-110 ${
                isDragging === 'min' ? 'scale-110 shadow-lg' : ''
              }`}
              style={{ left: `${minPercent}%` }}
              onPointerDown={(e) => handlePointerDown(e, 'min')}
            />
            <div
              className={`absolute w-5 h-5 bg-white rounded-full -top-1.5 -translate-x-1/2 border-2 border-violet-500 shadow-md cursor-grab active:cursor-grabbing transition-transform hover:scale-110 ${
                isDragging === 'max' ? 'scale-110 shadow-lg' : ''
              }`}
              style={{ left: `${maxPercent}%` }}
              onPointerDown={(e) => handlePointerDown(e, 'max')}
            />
          </div>

          {/* Quick range buttons */}
          <div className="flex gap-1.5 mt-3">
            {quickRanges.map((range) => {
              const isActive = rangeMin === range.min && rangeMax === range.max;
              return (
                <button
                  key={range.label}
                  type="button"
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-violet-100 text-violet-700 border border-violet-200'
                      : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700'
                  }`}
                  onClick={() => onChange(range.min, range.max)}
                >
                  {range.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
