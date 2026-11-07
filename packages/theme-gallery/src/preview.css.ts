import { media, vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { color, font, space } = vars;

/** Phones scroll the frame and the details as one column; from lg they sit
 * side by side and the frame takes the full height. */
export const main = style({
  flex: 1,
  minHeight: 0,
  display: 'grid',
  alignContent: 'start',
  overflowY: 'auto',
  '@media': {
    [media.lg]: {
      gridTemplateColumns: 'minmax(0, 1fr) 22rem',
      alignContent: 'stretch',
      overflow: 'hidden',
    },
  },
});

// Short enough on phones that the details show below it: a swipe on the
// frame scrolls the resume inside, so there must be room to swipe past it.
export const frameBox = style({
  position: 'relative',
  height: '55svh',
  backgroundColor: color.surface.muted,
  '@media': { [media.lg]: { height: 'auto' } },
});

export const shot = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'top',
});

export const frame = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  border: 0,
  // Themes are paper: white whatever the site's colour scheme.
  backgroundColor: '#ffffff',
  opacity: 0,
  transition: `opacity ${vars.motion.duration.base}`,
  selectors: { '&[data-loaded="true"]': { opacity: 1 } },
});

export const aside = style({
  display: 'grid',
  alignContent: 'start',
  gap: space[6],
  padding: space[6],
  '@media': {
    [media.lg]: {
      overflowY: 'auto',
      borderInlineStart: `1px solid ${color.border.subtle}`,
    },
  },
});

export const description = style({
  margin: 0,
  color: color.text.default,
  fontSize: font.size.sm,
  lineHeight: font.lineHeight.normal,
});

export const footer = style({
  alignItems: 'center',
  paddingInline: space[4],
  '@media': { [media.sm]: { paddingInline: space[6] } },
});

/** Only where there is a keyboard and room for the hint. */
export const keys = style({
  display: 'none',
  marginInlineEnd: 'auto',
  color: color.text.muted,
  fontSize: font.size.xs,
  '@media': {
    [`${media.md} and (hover: hover)`]: { display: 'inline' },
  },
});
