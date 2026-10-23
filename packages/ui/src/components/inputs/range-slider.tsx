'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { useId, useState } from 'react';
import { cx } from '../../utils/cx';
import * as s from './inputs.css';

export interface RangeSliderProps {
  /** One value for a single thumb, two for a range. */
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  /** Fires when dragging ends. */
  onValueCommit?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Visible label. */
  label: string;
  /** Formats values for display and for screen readers. */
  formatValue?: (value: number) => string;
  /** Optional counts across the range, drawn as bars behind the slider. */
  distribution?: number[];
  /** Accessible names for the two thumbs of a range. */
  thumbLabels?: [string, string];
  disabled?: boolean;
  className?: string;
}

/** Choose a value or a min–max range, optionally over a distribution (salary histogram). */
export function RangeSlider({
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  label,
  formatValue = String,
  distribution,
  thumbLabels = ['Minimum', 'Maximum'],
  disabled,
  className,
}: RangeSliderProps) {
  const [inner, setInner] = useState(defaultValue ?? [min, max]);
  const current = value ?? inner;
  const id = useId();
  const peak = distribution ? Math.max(1, ...distribution) : 1;
  const [lo = min, hi = lo] = current;

  return (
    <div className={className}>
      <div className={s.sliderHeader}>
        <span id={id}>{label}</span>
        <span className={s.sliderValue}>
          {current.length > 1
            ? `${formatValue(lo)} – ${formatValue(hi)}`
            : formatValue(lo)}
        </span>
      </div>
      {distribution ? (
        <div className={s.histogram} aria-hidden="true">
          {distribution.map((count, i) => {
            const bucketStart = min + ((max - min) * i) / distribution.length;
            const inRange =
              current.length > 1
                ? bucketStart >= lo && bucketStart < hi
                : bucketStart <= lo;
            return (
              <span
                key={i}
                className={s.histogramBar}
                data-in-range={inRange}
                style={assignInlineVars({
                  [s.barHeight]: `${(count / peak) * 100}%`,
                })}
              />
            );
          })}
        </div>
      ) : null}
      <SliderPrimitive.Root
        className={cx(s.sliderRoot)}
        value={current}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        minStepsBetweenThumbs={1}
        aria-labelledby={id}
        onValueChange={(v) => {
          if (value === undefined) setInner(v);
          onValueChange?.(v);
        }}
        onValueCommit={onValueCommit}
      >
        <SliderPrimitive.Track className={s.sliderTrack}>
          <SliderPrimitive.Range className={s.sliderRange} />
        </SliderPrimitive.Track>
        {current.map((v, i) => (
          <SliderPrimitive.Thumb
            key={i}
            className={s.sliderThumb}
            aria-label={current.length > 1 ? thumbLabels[i] : label}
            aria-valuetext={formatValue(v)}
          />
        ))}
      </SliderPrimitive.Root>
    </div>
  );
}
