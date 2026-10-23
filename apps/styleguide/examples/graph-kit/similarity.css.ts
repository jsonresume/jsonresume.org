import { createVar, style } from '@vanilla-extract/css';
import { vars } from '@jsonresume/ui/tokens';

export const zoom = createVar();

export const canvas = style({
  width: '100%',
  height: '100%',
  transform: `scale(${zoom})`,
  transition: `transform ${vars.motion.duration.base} ${vars.motion.easing.standard}`,
});

export const edge = style({
  stroke: vars.color.border.strong,
  strokeWidth: 1.5,
});

export const you = style({ fill: vars.color.action.primary });

export const job = style({
  fill: vars.color.action.ink,
  cursor: 'pointer',
  outline: 'none',
  selectors: {
    '&[data-selected="true"]': {
      stroke: vars.color.surface.brand,
      strokeWidth: 5,
    },
    '&:focus-visible': { stroke: vars.color.focus, strokeWidth: 4 },
  },
});
