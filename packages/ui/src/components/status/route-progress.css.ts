import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/contract.css';

const { color, motion, zIndex } = vars;

export const bar = style({
  position: 'fixed',
  insetBlockStart: 0,
  insetInline: 0,
  zIndex: zIndex.toast,
  height: '3px',
  backgroundColor: color.action.primary,
  transformOrigin: 'left',
  transform: 'scaleX(0)',
  opacity: 0,
  pointerEvents: 'none',
  selectors: {
    // Fast at first, then slower and slower: it never claims to be done.
    '&[data-phase="loading"]': {
      opacity: 1,
      transform: 'scaleX(0.85)',
      transition: `transform 8s cubic-bezier(0.1, 0.6, 0.2, 1), opacity ${motion.duration.fast}`,
    },
    '&[data-phase="done"]': {
      opacity: 0,
      transform: 'scaleX(1)',
      transition: `transform ${motion.duration.base} ${motion.easing.out}, opacity ${motion.duration.base} ${motion.easing.standard} ${motion.duration.base}`,
    },
  },
});
