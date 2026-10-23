import type { ReactNode } from 'react';
import { visuallyHidden } from '../../styles/shared.css';
import * as s from './inputs.css';

export interface ChipProps {
  children: ReactNode;
  /** Shows a remove button labelled "Remove <label>". */
  onRemove?: () => void;
  /** Plain-text name used in the remove button's label. */
  label?: string;
}

/** A small removable value: an active filter or a tag. */
export function Chip({ children, onRemove, label }: ChipProps) {
  return (
    <span className={s.chip}>
      <span className={s.chipLabel}>{children}</span>
      {onRemove ? (
        <button type="button" className={s.chipRemove} onClick={onRemove}>
          <svg width="10" height="10" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="m4 4 8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className={visuallyHidden}>
            Remove {label ?? (typeof children === 'string' ? children : '')}
          </span>
        </button>
      ) : null}
    </span>
  );
}
