import {
  createVar,
  keyframes,
  style,
  styleVariants,
} from '@vanilla-extract/css';
import { vars } from '../../../tokens/contract.css';

const { color, space, radius, motion, shadow } = vars;

/** Fills its parent, like TreeMap: give the parent a height. */
export const root = style({
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  background: color.surface.page,
});

export const bands = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
});

/** When a band's squares pulse: each band a little after the one above. */
export const delay = createVar();

const pulse = keyframes({ '50%': { opacity: 0.45 } });

export const band = style({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: space[3],
  paddingInline: space[4],
  borderBlockEnd: `1px dashed ${color.border.subtle}`,
  animation: `${pulse} 1.8s ${motion.easing.standard} ${delay} infinite`,
  selectors: { '&:last-child': { borderBlockEnd: 'none' } },
  '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
});

/** Where a TreeMap puts the band's name. */
export const bandName = style({
  flex: '0 0 auto',
  width: '4.5rem',
  height: '0.5rem',
  borderRadius: radius.full,
  backgroundColor: color.surface.muted,
});

export const squares = style({
  flex: 1,
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
});

const square = style({
  borderRadius: radius.sm,
  backgroundColor: color.surface.muted,
  border: `1px solid ${color.border.default}`,
});

export const sizes = styleVariants({
  small: [square, { width: '0.875rem', height: '0.875rem' }],
  medium: [square, { width: '1.25rem', height: '1.25rem' }],
  large: [square, { width: '1.75rem', height: '1.75rem' }],
});

export const caption = style({
  position: 'absolute',
  insetInline: space[4],
  top: '50%',
  transform: 'translateY(-50%)',
  marginInline: 'auto',
  maxWidth: '24rem',
  padding: space[4],
  borderRadius: radius.lg,
  border: `1px solid ${color.border.default}`,
  background: color.surface.raised,
  boxShadow: shadow.md,
});
