'use client';

import * as RadioGroup from '@radix-ui/react-radio-group';
import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import * as s from './inputs.css';

export interface SegmentedOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Names the group, e.g. "Editor mode". */
  label: string;
  className?: string;
}

/**
 * Pick one of a few modes in place (Form / JSON / AI). It's a radio group:
 * arrow keys move between options. Use Tabs when options switch panels.
 */
export function SegmentedControl({
  options,
  value,
  defaultValue,
  onValueChange,
  label,
  className,
}: SegmentedControlProps) {
  return (
    <RadioGroup.Root
      aria-label={label}
      orientation="horizontal"
      value={value}
      defaultValue={defaultValue ?? options[0]?.value}
      onValueChange={onValueChange}
      className={cx(s.segmented, className)}
    >
      {options.map((o) => (
        <RadioGroup.Item
          key={o.value}
          value={o.value}
          disabled={o.disabled}
          className={s.segment}
        >
          {o.icon ? <span aria-hidden="true">{o.icon}</span> : null}
          {o.label}
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}
