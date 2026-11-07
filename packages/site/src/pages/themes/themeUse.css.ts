import { vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { color, font, space } = vars;

export const use = style({ display: 'grid', gap: space[5] });

export const heading = style({
  margin: 0,
  color: color.text.strong,
  fontSize: font.size.md,
  fontWeight: font.weight.semibold,
});

export const way = style({
  display: 'grid',
  gap: space[2],
  minWidth: 0,
});

export const title = style({
  margin: 0,
  color: color.text.strong,
  fontSize: font.size.sm,
  fontWeight: font.weight.semibold,
});

export const text = style({
  margin: 0,
  color: color.text.muted,
  fontSize: font.size.sm,
  lineHeight: font.lineHeight.normal,
  overflowWrap: 'anywhere',
});

export const action = style({ justifySelf: 'start' });
