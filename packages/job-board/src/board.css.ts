import { media, vars } from '@jsonresume/ui/tokens';
import { globalStyle, style } from '@vanilla-extract/css';

const { color, font, space } = vars;

export const list = style({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  display: 'grid',
  gap: space[3],
});

export const card = style({
  display: 'grid',
  gap: space[4],
  padding: space[4],
  '@media': {
    [media.md]: {
      gridTemplateColumns: '1fr auto',
      alignItems: 'start',
      padding: space[5],
    },
  },
});

export const main = style({
  display: 'grid',
  gap: space[2],
  minWidth: 0,
  overflowWrap: 'anywhere',
});

export const overline = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: `0 ${space[2]}`,
  color: color.text.muted,
  fontSize: font.size.xs,
});

/** Why a job fits the reader, under its title. */
export const note = style({
  margin: 0,
  color: color.text.muted,
  fontSize: font.size.sm,
});

export const company = style({
  color: color.text.default,
  fontWeight: font.weight.semibold,
});

export const title = style({
  margin: 0,
  fontSize: font.size.lg,
  lineHeight: font.lineHeight.snug,
  fontWeight: font.weight.semibold,
});

export const titleLink = style({
  color: color.text.strong,
  textDecoration: 'none',
  selectors: {
    '&:hover': { color: color.text.link, textDecoration: 'underline' },
    // The whole card is the link's target area.
    '&::after': { content: '""', position: 'absolute', inset: 0 },
  },
});

export const meta = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[2],
  alignItems: 'center',
});

// A long place ("San Francisco Bay Area preferred, …") wraps, not overflows.
globalStyle(`${meta} > *`, {
  maxWidth: '100%',
  whiteSpace: 'normal',
  overflowWrap: 'anywhere',
});

export const skills = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[1],
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const skill = style({
  padding: `0 ${space[2]}`,
  borderRadius: vars.radius.full,
  background: color.surface.muted,
  color: color.text.default,
  fontSize: font.size.xs,
  lineHeight: '1.75',
});

export const aside = style({
  position: 'relative',
  zIndex: 1,
  display: 'grid',
  gap: space[2],
  justifyItems: 'start',
  '@media': {
    [media.md]: { justifyItems: 'end' },
  },
});

export const positioned = style({ position: 'relative' });

export const filters = style({ marginBlockEnd: space[4] });

export const search = style({ flex: '1 1 16rem' });

// On phones the search keeps a row to itself, the selects share the next.
globalStyle(`${filters} ${search}`, {
  '@media': { [`screen and (max-width: 767px)`]: { flexBasis: '100%' } },
});

export const more = style({
  display: 'flex',
  justifyContent: 'center',
  marginBlockStart: space[6],
});

export const empty = style({ marginBlockStart: space[6] });
