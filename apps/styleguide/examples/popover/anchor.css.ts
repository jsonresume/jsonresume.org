import { style } from '@vanilla-extract/css';
import { vars } from '@jsonresume/ui/tokens';

export const row = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  width: 'min(100%, 26rem)',
});

export const search = style({ flex: 1, minWidth: 0 });

// As wide as the row it hangs from.
export const panel = style({ width: 'var(--radix-popover-trigger-width)' });
