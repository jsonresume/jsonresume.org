import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import * as s from './status.css';

export interface StatusOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface StatusToggleProps {
  options: StatusOption[];
  /** The current status, or null for none. */
  value: string | null;
  /** Pressing the current status again clears it (null). */
  onValueChange: (value: string | null) => void;
  /** Names the group, e.g. "Status for Senior Engineer at Stripe". */
  label: string;
  /** Show only icons; labels move to aria-label. */
  iconOnly?: boolean;
}

/**
 * Mark an item read, interested or hidden. Each option is a toggle button
 * (aria-pressed); at most one is on. Pair with a toast offering Undo.
 */
export function StatusToggle({
  options,
  value,
  onValueChange,
  label,
  iconOnly = false,
}: StatusToggleProps) {
  return (
    <div role="group" aria-label={label} className={s.toggleGroup}>
      {options.map((o) => {
        const pressed = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            className={cx(s.toggle, iconOnly && s.toggleIconOnly)}
            aria-pressed={pressed}
            aria-label={iconOnly ? o.label : undefined}
            title={iconOnly ? o.label : undefined}
            onClick={() => onValueChange(pressed ? null : o.value)}
          >
            {o.icon ? <span aria-hidden="true">{o.icon}</span> : null}
            {iconOnly ? null : o.label}
          </button>
        );
      })}
    </div>
  );
}
