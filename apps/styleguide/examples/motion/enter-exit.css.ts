import { style } from '@vanilla-extract/css';
import { vars } from '@jsonresume/ui/tokens';

const { duration, easing } = vars.motion;

// Enter with easing.out (fast start, gentle stop): fade and rise 8px.
// Only opacity and transform change, so nothing reflows.
export const note = style({
  opacity: 0,
  transform: 'translateY(8px)',
  visibility: 'hidden',
  transition: `opacity ${duration.base} ${easing.out}, transform ${duration.base} ${easing.out}, visibility ${duration.base}`,
  selectors: {
    '&[data-open="true"]': {
      opacity: 1,
      transform: 'none',
      visibility: 'visible',
    },
  },
});
