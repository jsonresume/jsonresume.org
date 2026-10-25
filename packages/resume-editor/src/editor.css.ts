import { vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { color, space, shadow } = vars;

/** Phones: Save stays at the bottom of the screen while the form scrolls. */
export const saveBar = style({
  position: 'fixed',
  insetInline: 0,
  bottom: 0,
  zIndex: vars.zIndex.sticky,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[3],
  padding: `${space[3]} ${space[4]}`,
  paddingBlockEnd: `calc(${space[3]} + env(safe-area-inset-bottom))`,
  borderBlockStart: `1px solid ${color.border.default}`,
  backgroundColor: color.surface.raised,
  boxShadow: shadow.md,
});

/** Room under the form for the bar, so it never covers the last field. */
export const saveBarSpace = style({ height: '5rem' });
