import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/contract.css';
import { media } from '../../tokens/theme';

const { font, color, space } = vars;

export const steps = style({
  counterReset: 'jr-step',
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'grid',
  gap: space[10],
  '@media': {
    [media.md]: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))',
      gap: space[8],
    },
  },
});

export const step = style({
  counterIncrement: 'jr-step',
  display: 'grid',
  alignContent: 'start',
  gap: space[3],
  paddingBlockStart: space[5],
  borderBlockStart: `2px solid ${color.surface.brand}`,
  '::before': {
    content: 'counter(jr-step, decimal-leading-zero)',
    color: color.text.muted,
    fontSize: font.size['2xl'],
    fontWeight: font.weight.light,
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
  },
});

export const title = style({
  margin: 0,
  color: color.text.strong,
  fontSize: font.size.lg,
  fontWeight: font.weight.semibold,
  lineHeight: font.lineHeight.snug,
});

export const body = style({
  color: color.text.default,
  fontSize: font.size.sm,
  lineHeight: font.lineHeight.normal,
});
