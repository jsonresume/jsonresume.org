import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '../../tokens/contract.css';
import { media } from '../../tokens/theme';

const { color, font, space, radius, shadow } = vars;

/* AppPage */

export const page = style({
  display: 'grid',
  // minmax(0, …): wide content (code, tables) scrolls inside instead of
  // widening the page past the screen.
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: space[6],
  maxWidth: '84rem',
  marginInline: 'auto',
});

/**
 * fill: from lg up the page takes the viewport's height (less the shell's
 * padding) and its body the rest, so a workspace inside can scroll its own
 * panes. Smaller screens keep ordinary page scrolling.
 */
export const pageFill = style({
  '@media': {
    [media.lg]: {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 'none',
      height: `calc(100dvh - ${space[8]} - ${space[8]})`,
      minHeight: '36rem',
    },
  },
});

export const fillBody = style({
  '@media': {
    [media.lg]: {
      flex: 1,
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: space[4],
    },
  },
});

// Notices and the like sit on top at their own height; the last child (the
// workspace) takes what is left.
globalStyle(`${fillBody} > :last-child`, {
  '@media': { [media.lg]: { flex: 1, minHeight: 0 } },
});

export const header = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: space[4],
});

export const titles = style({ display: 'grid', gap: space[1], minWidth: 0 });

export const title = style({
  margin: 0,
  color: color.text.strong,
  fontSize: font.size['2xl'],
  fontWeight: font.weight.light,
  lineHeight: font.lineHeight.tight,
  '@media': { [media.md]: { fontSize: font.size['3xl'] } },
});

export const description = style({
  margin: 0,
  color: color.text.muted,
  fontSize: font.size.sm,
});

export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[2],
});

export const toolbar = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: space[3],
});

/* AuthCard */

export const authWrap = style({
  display: 'grid',
  placeItems: 'center',
  paddingBlock: space[12],
  paddingInline: space[4],
});

export const authCard = style({
  display: 'grid',
  gap: space[6],
  width: 'min(100%, 26rem)',
  padding: space[8],
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.lg,
  backgroundColor: color.surface.raised,
  boxShadow: shadow.sm,
});

export const authHead = style({
  display: 'grid',
  gap: space[2],
  textAlign: 'center',
});

export const authTitle = style({
  margin: 0,
  color: color.text.strong,
  fontSize: font.size['2xl'],
  fontWeight: font.weight.light,
  lineHeight: font.lineHeight.tight,
});

export const authFooter = style({
  margin: 0,
  color: color.text.muted,
  fontSize: font.size.sm,
  textAlign: 'center',
});

/* GithubIcon */

export const icon = style({
  display: 'inline-block',
  flexShrink: 0,
  width: '1em',
  height: '1em',
  verticalAlign: '-0.125em',
});
