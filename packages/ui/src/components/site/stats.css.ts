import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/contract.css';
import { media } from '../../tokens/theme';

const { font, color, space } = vars;

export const stats = style({
  margin: 0,
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: `${space[8]} ${space[6]}`,
  '@media': {
    [media.md]: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(9rem, 1fr))',
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
  fontSize: font.size['3xl'],
  fontWeight: font.weight.light,
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums',
});

export const label = style({
  color: color.text.muted,
  fontSize: font.size['2xs'],
  fontWeight: font.weight.semibold,
  letterSpacing: font.tracking.caps,
  textTransform: 'uppercase',
});
