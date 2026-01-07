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
}) {
  const [isDragging, setIsDragging] = useState(null); // 'min', 'max', or null
  const sliderRef = useRef(null);

  // Use percentile range to exclude outliers (fallback to full range)
  const displayMin = p5 ?? min;
  const displayMax = p95 ?? max;

  // Current range values (defaults to percentile range)
  const rangeMin = value?.min ?? displayMin;
  const rangeMax = value?.max ?? displayMax;

  // Calculate positions as percentages (using display range for slider)
  const minPercent =
    ((rangeMin - displayMin) / (displayMax - displayMin)) * 100 || 0;
  const maxPercent =
    ((rangeMax - displayMin) / (displayMax - displayMin)) * 100 || 100;

  // Find max count for histogram scaling
  const maxCount = useMemo(() => {
    return Math.max(...histogram.map((h) => h.count), 1);
  }, [histogram]);

  // Convert position to value (using display range)
  const positionToValue = useCallback(
    (clientX) => {
      if (!sliderRef.current) return displayMin;
      const rect = sliderRef.current.getBoundingClientRect();
      const percent = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width)
      );
      // Snap to nearest $5k
      const value = displayMin + percent * (displayMax - displayMin);
      return Math.round(value / 5000) * 5000;
    },
    [displayMin, displayMax]
  );

  // Handle mouse/touch events
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

  // Add global listeners when dragging
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

  // Check if a histogram bar is within the selected range
  const isBarInRange = useCallback(
    (bar) => {
      return bar.max >= rangeMin && bar.min <= rangeMax;
    },
    [rangeMin, rangeMax]
  );

  if (displayMax <= displayMin || histogram.length === 0) {
    return null;
  }

  // Filter histogram to only show bars within display range
  const visibleHistogram = histogram.filter(
    (bar) => bar.max >= displayMin && bar.min <= displayMax
  );

  return (
    <div className={`salary-histogram-slider ${className}`}>
      {/* Labels */}
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{formatSalary(rangeMin)}</span>
        <span className="text-gray-400">Salary Range</span>
        <span>{formatSalary(rangeMax)}</span>
      </div>

      {/* Histogram bars */}
      <div className="histogram-bars flex items-end h-8 gap-px mb-1">
        {visibleHistogram.map((bar, index) => {
          const height = (bar.count / maxCount) * 100;
          const inRange = isBarInRange(bar);
          return (
            <div
              key={index}
              className="histogram-bar flex-1 transition-all duration-150"
              style={{
                height: `${Math.max(height, 4)}%`,
                backgroundColor: inRange ? '#22c55e' : '#e5e7eb',
                opacity: inRange ? 1 : 0.5,
              }}
              title={`${formatSalary(bar.min)} - ${formatSalary(bar.max)}: ${
                bar.count
              } jobs`}
            />
          );
        })}
      </div>

      {/* Slider track */}
      <div
        ref={sliderRef}
        className="slider-track relative h-2 bg-gray-200 rounded-full cursor-pointer"
      >
        {/* Selected range highlight */}
        <div
          className="absolute h-full bg-green-500 rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Min handle */}
        <div
          className="slider-handle absolute w-4 h-4 bg-white border-2 border-green-500 rounded-full -top-1 transform -translate-x-1/2 cursor-grab active:cursor-grabbing shadow-md hover:scale-110 transition-transform"
          style={{ left: `${minPercent}%` }}
          onPointerDown={(e) => handlePointerDown(e, 'min')}
        />

        {/* Max handle */}
        <div
          className="slider-handle absolute w-4 h-4 bg-white border-2 border-green-500 rounded-full -top-1 transform -translate-x-1/2 cursor-grab active:cursor-grabbing shadow-md hover:scale-110 transition-transform"
          style={{ left: `${maxPercent}%` }}
          onPointerDown={(e) => handlePointerDown(e, 'max')}
        />
      </div>

      {/* Quick range buttons */}
      <div className="flex gap-1 mt-2 text-xs">
        <button
          type="button"
          className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors"
          onClick={() => onChange(displayMin, displayMax)}
        >
          All
        </button>
        <button
          type="button"
          className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors"
          onClick={() => onChange(displayMin, 100000)}
        >
          &lt;$100k
        </button>
        <button
          type="button"
          className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors"
          onClick={() => onChange(100000, 200000)}
        >
          $100-200k
        </button>
        <button
          type="button"
          className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors"
          onClick={() => onChange(200000, displayMax)}
        >
          $200k+
        </button>
      </div>
    </div>
  );
}
