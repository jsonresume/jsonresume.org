import { createVar, style } from '@vanilla-extract/css';
import { vars } from '@jsonresume/ui/tokens';

/** Set per row with assignInlineVars. */
export const duration = createVar();

export const row = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[4],
});

export const label = style({
  flexShrink: 0,
  width: '12rem',
  whiteSpace: 'nowrap',
  fontFamily: vars.font.family.mono,
  fontSize: vars.font.size.xs,
  color: vars.color.text.muted,
});

export const track = style({ position: 'relative', flex: 1, height: '2rem' });

export const box = style({
  position: 'absolute',
  insetBlock: 0,
  width: '2rem',
  borderRadius: vars.radius.sm,
  background: vars.color.action.primary,
  transition: `transform ${duration} ${vars.motion.easing.standard}`,
  selectors: {
    '[data-moved="true"] &': {
      transform: 'translateX(calc(min(24rem, 60vw)))',
    },
  },
});

export const start = style({ alignSelf: 'flex-start' });
