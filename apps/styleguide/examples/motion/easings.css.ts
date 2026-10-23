import { createVar, style } from '@vanilla-extract/css';
import { media, vars } from '@jsonresume/ui/tokens';

/** Set per row with assignInlineVars. */
export const easing = createVar();

export const track = style({
  position: 'relative',
  height: '1.5rem',
  background: vars.color.surface.subtle,
});

export const box = style({
  position: 'absolute',
  insetBlock: 0,
  width: '1.5rem',
  background: vars.color.action.ink,
  // A slow duration so the curve is visible; real UI uses base.
  transition: `transform 900ms ${easing}`,
  selectors: {
    '[data-moved="true"] &': {
      transform: 'translateX(calc(min(30rem, 70vw)))',
    },
  },
  '@media': { [media.reducedMotion]: { transition: 'none' } },
});

export const start = style({ alignSelf: 'flex-start' });
