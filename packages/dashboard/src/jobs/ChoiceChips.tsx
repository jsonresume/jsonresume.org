import { Button } from '@jsonresume/ui';
import * as s from './wants.css';

/**
 * Pick several of a few options as toggle chips, kept in the order picked
 * (the first is the favourite where order matters). `most` caps how many.
 */
export function ChoiceChips<T extends string>({
  label,
  options,
  value,
  onChange,
  most,
}: {
  label: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  value: ReadonlyArray<T>;
  onChange: (value: T[]) => void;
  most?: number;
}) {
  const full = most !== undefined && value.length >= most;
  return (
    <div className={s.choices} role="group" aria-label={label}>
      {options.map((o) => {
        const on = value.includes(o.value);
        const at = value.indexOf(o.value);
        return (
          <Button
            key={o.value}
            type="button"
            size="sm"
            variant={on ? 'ink' : 'secondary'}
            aria-pressed={on}
            disabled={!on && full}
            onClick={() =>
              onChange(
                on ? value.filter((v) => v !== o.value) : [...value, o.value]
              )
            }
          >
            {most !== undefined && on ? `${at + 1}. ${o.label}` : o.label}
          </Button>
        );
      })}
    </div>
  );
}
