import { keyframes, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { onBrandVars } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';

const { color, font, space, radius, motion } = vars;

export const log = style({
  display: 'grid',
  alignContent: 'start',
  gap: space[4],
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  padding: space[4],
});

export const message = recipe({
  base: {
    display: 'grid',
    gridTemplateColumns: 'auto minmax(0, 1fr)',
    gap: space[3],
    alignItems: 'start',
  },
  variants: {
    role: {
      user: { gridTemplateColumns: 'minmax(0, 1fr) auto', justifyItems: 'end' },
      assistant: {},
      system: { gridTemplateColumns: '1fr', justifyItems: 'center' },
    },
  },
});

export const bubble = recipe({
  base: {
    maxWidth: 'min(42rem, 100%)',
    padding: `${space[3]} ${space[4]}`,
    borderRadius: radius.lg,
    fontSize: font.size.sm,
    lineHeight: font.lineHeight.normal,
    overflowWrap: 'anywhere',
  },
  variants: {
    role: {
      user: {
        gridColumn: 1,
        gridRow: 1,
        backgroundColor: color.surface.brand,
        color: color.text.onBrand,
        borderEndEndRadius: radius.sm,
        vars: onBrandVars,
      },
      assistant: {
        backgroundColor: color.surface.subtle,
        border: `1px solid ${color.border.subtle}`,
        color: color.text.default,
        borderEndStartRadius: radius.sm,
      },
      system: { padding: 0, color: color.text.muted, fontSize: font.size.xs },
    },
  },
});

export const author = style({
  display: 'block',
  marginBlockEnd: space[1],
  color: color.text.muted,
  fontSize: font.size['2xs'],
  fontWeight: font.weight.semibold,
  letterSpacing: font.tracking.caps,
  textTransform: 'uppercase',
});

const blink = keyframes({
  '0%, 80%, 100%': { opacity: 0.25 },
  '40%': { opacity: 1 },
});

export const typing = style({
  display: 'inline-flex',
  gap: '3px',
  alignItems: 'center',
  height: '1em',
});

export const typingDot = style({
  width: '6px',
  height: '6px',
  borderRadius: radius.full,
  backgroundColor: 'currentColor',
  animation: `${blink} 1.2s ${motion.easing.standard} infinite`,
  selectors: {
    '&:nth-child(2)': { animationDelay: '0.15s' },
    '&:nth-child(3)': { animationDelay: '0.3s' },
  },
});

export const tool = style({
  marginBlock: space[2],
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.md,
  backgroundColor: color.surface.raised,
  fontSize: font.size.xs,
});

export const toolSummary = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[2],
  padding: `${space[2]} ${space[3]}`,
  cursor: 'pointer',
  color: color.text.default,
});

export const toolName = style({
  fontFamily: font.family.mono,
  color: color.text.strong,
});

export const toolBody = style({
  margin: 0,
  padding: space[3],
  borderBlockStart: `1px solid ${color.border.subtle}`,
  overflowX: 'auto',
  fontFamily: font.family.mono,
  whiteSpace: 'pre-wrap',
  color: color.text.muted,
});
