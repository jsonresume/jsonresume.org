import { createVar, style } from '@vanilla-extract/css';
import { vars } from '@jsonresume/ui/tokens';

const { space } = vars;

/** How far the top card has been dragged, in px. */
export const dragX = createVar();

export const deck = style({
  display: 'grid',
  gap: space[4],
  maxWidth: '28rem',
  marginInline: 'auto',
});

export const card = style({
  transform: `translateX(${dragX}) rotate(calc(${dragX} / 24))`,
  transition: 'transform 200ms ease-out',
  touchAction: 'pan-y',
  cursor: 'grab',
  userSelect: 'none',
  vars: { [dragX]: '0px' },
});

export const dragging = style({ transition: 'none', cursor: 'grabbing' });

export const buttons = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: space[2],
});

export const hint = style({ textAlign: 'center' });
