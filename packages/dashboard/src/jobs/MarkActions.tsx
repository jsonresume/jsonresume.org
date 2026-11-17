import {
  Button,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@jsonresume/ui';
import { passReasonLabels, type JobMark, type PassReason } from '@repo/api';
import * as s from './decide.css';
import * as w from './wants.css';

const REASONS = Object.keys(passReasonLabels) as PassReason[];

export interface MarkChange {
  mark: JobMark | null;
  reason?: PassReason;
}

/**
 * Save, applied, and pass (asking why, in one tap: the answer teaches the
 * suggestions). Pressing a mark that is on clears it.
 */
export function MarkActions({
  mark,
  title,
  onMark,
}: {
  mark: JobMark | null;
  title: string;
  onMark: (change: MarkChange) => void;
}) {
  const toggle = (value: JobMark) => () =>
    onMark({ mark: mark === value ? null : value });
  const passed = mark === 'not_interested';
  return (
    <div className={s.actions} role="group" aria-label={`Mark ${title}`}>
      <Button
        size="sm"
        variant={mark === 'interested' ? 'primary' : 'secondary'}
        aria-pressed={mark === 'interested'}
        onClick={toggle('interested')}
      >
        Save
      </Button>
      <Button
        size="sm"
        variant={mark === 'applied' ? 'primary' : 'secondary'}
        aria-pressed={mark === 'applied'}
        onClick={toggle('applied')}
      >
        Applied
      </Button>
      {passed ? (
        <Button
          size="sm"
          variant="primary"
          aria-pressed
          onClick={toggle('not_interested')}
        >
          Passed
        </Button>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm" variant="secondary" aria-pressed={false}>
              Pass
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end">
            <div className={w.reasonsMenu}>
              <p className={w.sectionTitle}>What’s not right?</p>
              <div className={w.reasonChips}>
                {REASONS.map((reason) => (
                  <PopoverClose asChild key={reason}>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onMark({ mark: 'not_interested', reason })}
                    >
                      {passReasonLabels[reason]}
                    </Button>
                  </PopoverClose>
                ))}
              </div>
              <PopoverClose asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onMark({ mark: 'not_interested' })}
                >
                  Just pass
                </Button>
              </PopoverClose>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
