import { style } from '@vanilla-extract/css';
import { vars } from '@jsonresume/ui/tokens';

const { color, space, radius } = vars;

export const wrap = style({
  display: 'grid',
  justifyItems: 'start',
  gap: space[4],
});

// SkipLink is absolutely positioned, so its frame (usually the page) is
// relative; here the frame also clips it while hidden.
export const frame = style({
  position: 'relative',
  justifySelf: 'stretch',
  overflow: 'hidden',
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.md,
  backgroundColor: color.surface.raised,
});

export const nav = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[4],
  padding: `${space[12]} ${space[5]} ${space[4]}`,
  borderBlockEnd: `1px solid ${color.border.subtle}`,
});

export const content = style({
  padding: space[5],
  color: color.text.muted,
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${color.focus}`,
      outlineOffset: '-2px',
    },
  },
});
