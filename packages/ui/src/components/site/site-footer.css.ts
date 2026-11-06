import { globalStyle, style } from '@vanilla-extract/css';
import { transition } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';
import { media } from '../../tokens/theme';

const { font, color, space } = vars;

export const footer = style({
  paddingBlock: `${space[12]} max(${space[8]}, env(safe-area-inset-bottom))`,
  borderBlockStart: `1px solid ${color.border.subtle}`,
  backgroundColor: color.surface.subtle,
  color: color.text.muted,
  fontSize: font.size.sm,
});

// Only the lists' links: the brand slot styles itself.
globalStyle(`${footer} li a`, {
  // Padded so each link is easy to tap.
  display: 'inline-block',
  paddingBlock: space[1],
  color: color.text.default,
  textDecoration: 'none',
  transition: `color ${transition}`,
  '@media': { [media.coarse]: { paddingBlock: space[2] } },
});
globalStyle(`${footer} li a:hover`, {
  color: color.text.link,
  textDecoration: 'underline',
  textUnderlineOffset: '0.2em',
});

/* One list: small, centred, uppercase links. */
export const simple = style({
  backgroundColor: 'transparent',
  textAlign: 'center',
  fontSize: font.size['2xs'],
  letterSpacing: font.tracking.caps,
  textTransform: 'uppercase',
});
globalStyle(`${simple} li a`, { color: color.text.muted });

export const footerLinks = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: `0 ${space[4]}`,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const footerNote = style({ marginBlockStart: space[4] });

/* Columns: the brand first, then two groups a row on phones, all in one row
   from lg up. */
export const columns = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: `${space[8]} ${space[6]}`,
  '@media': {
    [media.md]: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
    [media.lg]: { gridTemplateColumns: '1.4fr repeat(3, minmax(0, 1fr))' },
  },
});

export const about = style({
  display: 'grid',
  alignContent: 'start',
  justifyItems: 'start',
  gap: space[3],
  gridColumn: '1 / -1',
  color: color.text.strong,
  '@media': { [media.lg]: { gridColumn: 'auto' } },
});

export const aboutNote = style({
  maxWidth: '32ch',
  color: color.text.muted,
  lineHeight: font.lineHeight.normal,
});

export const group = style({ display: 'grid', alignContent: 'start' });

export const groupTitle = style({
  marginBlockEnd: space[2],
  color: color.text.muted,
  fontSize: font.size['2xs'],
  fontWeight: font.weight.semibold,
  letterSpacing: font.tracking.caps,
  textTransform: 'uppercase',
});

export const groupLinks = style({
  display: 'grid',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const legal = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: `0 ${space[5]}`,
  gridColumn: '1 / -1',
  margin: 0,
  paddingBlockStart: space[6],
  paddingInline: 0,
  borderBlockStart: `1px solid ${color.border.subtle}`,
  listStyle: 'none',
  fontSize: font.size.xs,
});
globalStyle(`${legal} li a`, { color: color.text.muted });
