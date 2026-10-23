import { vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { color, font, space } = vars;

export const form = style({ display: 'grid', gap: space[4] });
export const icon = style({
  width: '1.1em',
  height: '1.1em',
  marginInlineEnd: space[2],
});
export const note = style({
  margin: 0,
  color: color.text.muted,
  fontSize: font.size.xs,
});
export const muted = style({ color: color.text.muted });
export const good = style({ color: color.status.success });
export const bad = style({ color: color.status.danger });
