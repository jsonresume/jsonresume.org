import { vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { space, radius, color } = vars;

export const previews = style({
  display: 'grid',
  gap: space[3],
  gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))',
  marginBlockEnd: space[4],
});

const panel = style({
  display: 'grid',
  placeItems: 'center',
  padding: space[6],
  borderRadius: radius.md,
  border: `1px solid ${color.border.subtle}`,
});

// Fixed backgrounds: the badge shown as it looks on a light and a dark page.
export const light = style([panel, { background: '#ffffff' }]);
export const dark = style([panel, { background: '#0d1117' }]);
