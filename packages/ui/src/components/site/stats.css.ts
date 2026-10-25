import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/contract.css';
import { media } from '../../tokens/theme';

const { font, color, space } = vars;

export const stats = style({
  margin: 0,
  display: 'grid',
  // Three figures sit in one row even on a phone; more wrap.
  gridTemplateColumns: 'repeat(auto-fit, minmax(5.5rem, 1fr))',
  gap: `${space[8]} ${space[4]}`,
  '@media': {
    [media.md]: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(9rem, 1fr))',
      columnGap: space[6],
    },
  },
});

export const stat = style({
  display: 'flex',
  flexDirection: 'column-reverse',
  gap: space[2],
  textAlign: 'center',
});

export const value = style({
  margin: 0,
  color: color.text.strong,
  fontSize: font.size['2xl'],
  fontWeight: font.weight.light,
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums',
  '@media': { [media.sm]: { fontSize: font.size['3xl'] } },
});

export const label = style({
  color: color.text.muted,
  fontSize: font.size['2xs'],
  fontWeight: font.weight.semibold,
  letterSpacing: font.tracking.caps,
  textTransform: 'uppercase',
});
