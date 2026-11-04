import { keyframes } from '@vanilla-extract/css';

/* Exits for Radix overlays: Radix keeps a closing element mounted until
   its animation ends, so a closed state with its own animation fades or
   slides away instead of vanishing. */

export const fadeOut = keyframes({ to: { opacity: 0 } });

export const popOut = keyframes({
  to: { opacity: 0, transform: 'scale(0.97)' },
});

/** For the centred dialog, which positions itself with a transform. */
export const sinkOut = keyframes({
  to: { opacity: 0, transform: 'translate(-50%, calc(-50% + 8px))' },
});

export const slideOut = {
  right: keyframes({ to: { transform: 'translateX(100%)' } }),
  left: keyframes({ to: { transform: 'translateX(-100%)' } }),
  bottom: keyframes({ to: { transform: 'translateY(100%)' } }),
};
