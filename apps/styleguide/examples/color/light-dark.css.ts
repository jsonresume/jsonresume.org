import { style } from '@vanilla-extract/css';
import { vars } from '@jsonresume/ui/tokens';

// The panel paints its own page surface, so each half shows its theme.
export const panel = style({
  display: 'grid',
  gap: vars.space[4],
  padding: vars.space[5],
  background: vars.color.surface.page,
  color: vars.color.text.default,
});
