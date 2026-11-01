import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../../../tokens/contract.css';

const { color, font, space } = vars;

export const legend = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: `${space[1]} ${space[4]}`,
  margin: 0,
  padding: 0,
  listStyle: 'none',
  color: color.text.muted,
  fontSize: font.size.sm,
});

export const item = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: space[2],
});

/** The hatch the map draws: 2px strokes, 6px apart, rising to the right. */
const hatch = (ink: string) =>
  `repeating-linear-gradient(45deg, ${ink} 0 1.5px, transparent 1.5px 4.25px)`;

const swatchBase = style({
  flex: 'none',
  width: '0.75rem',
  height: '0.75rem',
  boxSizing: 'border-box',
  border: `1px solid ${color.border.strong}`,
  background: color.surface.page,
  '@media': {
    '(forced-colors: active)': { forcedColorAdjust: 'none' },
  },
});

/** Each tone as the map draws it (render-canvas.ts). */
export const swatch = styleVariants({
  open: [swatchBase],
  success: [
    swatchBase,
    { background: color.status.success, borderColor: color.status.success },
  ],
  danger: [
    swatchBase,
    { background: color.status.danger, borderColor: color.status.danger },
  ],
  attention: [
    swatchBase,
    {
      borderColor: color.status.warning,
      backgroundImage: hatch(color.status.warning),
    },
  ],
  active: [
    swatchBase,
    {
      borderColor: color.text.default,
      backgroundImage: hatch(color.text.muted),
    },
  ],
  // The corner the map cuts from (s, 0.34s) to (0.34s, s).
  closable: [
    swatchBase,
    {
      backgroundImage: `linear-gradient(to bottom right, transparent 67%, ${color.status.success} 67%)`,
    },
  ],
});
