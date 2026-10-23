import { createVar, globalStyle, keyframes, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { focusRing, transition } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';

const { color, font, space, radius, motion } = vars;

/* PageState */

export const pageState = recipe({
  base: {
    display: 'grid',
    justifyItems: 'center',
    alignContent: 'center',
    gap: space[3],
    textAlign: 'center',
  },
  variants: {
    size: {
      page: { minHeight: '60vh', padding: `${space[16]} ${space[6]}` },
      panel: { padding: `${space[10]} ${space[6]}` },
    },
  },
  defaultVariants: { size: 'page' },
});

export const stateIcon = style({
  width: '2.5rem',
  height: '2.5rem',
  color: color.text.muted,
});

export const stateCode = style({
  color: color.text.muted,
  fontSize: font.size['2xs'],
  fontWeight: font.weight.semibold,
  letterSpacing: font.tracking.caps,
  textTransform: 'uppercase',
});

export const stateTitle = style({
  margin: 0,
  color: color.text.strong,
  fontSize: font.size['2xl'],
  fontWeight: font.weight.light,
  lineHeight: font.lineHeight.tight,
});

export const stateText = style({
  maxWidth: '44ch',
  margin: 0,
  color: color.text.muted,
  fontSize: font.size.sm,
});

export const stateActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: space[2],
  marginBlockStart: space[2],
});

export const stateDetails = style({
  maxWidth: '44ch',
  color: color.text.muted,
  fontSize: font.size.xs,
  textAlign: 'start',
});

globalStyle(`${stateDetails} pre`, {
  marginBlockStart: space[2],
  padding: space[3],
  overflowX: 'auto',
  border: `1px solid ${color.border.subtle}`,
  borderRadius: radius.sm,
  backgroundColor: color.surface.subtle,
  fontFamily: font.family.mono,
  whiteSpace: 'pre-wrap',
});

/* SignInGate */

export const gateFeatures = style({
  display: 'grid',
  gap: space[2],
  margin: 0,
  padding: 0,
  listStyle: 'none',
  color: color.text.default,
  fontSize: font.size.sm,
  textAlign: 'start',
});

export const gateFeature = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: space[2],
});

/* ScoreMeter */

export const progress = createVar();
export const toneColor = createVar();
export const numberSize = createVar();

export const meter = recipe({
  base: {
    display: 'inline-grid',
    justifyItems: 'center',
    gap: space[2],
    vars: { [toneColor]: color.text.strong, [numberSize]: font.size.xl },
  },
  variants: {
    tone: {
      danger: { vars: { [toneColor]: color.status.danger } },
      warning: { vars: { [toneColor]: color.status.warning } },
      success: { vars: { [toneColor]: color.status.success } },
      neutral: { vars: { [toneColor]: color.action.ink } },
    },
  },
});

export const ring = style({
  position: 'relative',
  display: 'grid',
  placeItems: 'center',
});

const draw = keyframes({ from: { strokeDashoffset: 100 } });

export const ringTrack = style({ fill: 'none', stroke: color.border.default });

export const ringValue = style({
  fill: 'none',
  stroke: toneColor,
  strokeLinecap: 'round',
  strokeDasharray: '100',
  strokeDashoffset: `calc(100 - ${progress})`,
  transform: 'rotate(-90deg)',
  transformOrigin: 'center',
  animation: `${draw} ${motion.duration.slow} ${motion.easing.out}`,
  transition: `stroke-dashoffset ${motion.duration.base} ${motion.easing.standard}`,
});

export const ringLabel = style({
  position: 'absolute',
  display: 'grid',
  justifyItems: 'center',
  lineHeight: 1,
});

export const scoreNumber = style({
  fontSize: numberSize,
  color: color.text.strong,
  fontWeight: font.weight.light,
  fontVariantNumeric: 'tabular-nums',
});

export const scoreOutOf = style({
  color: color.text.muted,
  fontSize: font.size.xs,
});

export const band = style({
  color: toneColor,
  fontSize: font.size['2xs'],
  fontWeight: font.weight.semibold,
  letterSpacing: font.tracking.caps,
  textTransform: 'uppercase',
});

export const meterTitle = style({
  color: color.text.default,
  fontSize: font.size.sm,
  fontWeight: font.weight.semibold,
});

export const bar = style({
  display: 'grid',
  gap: space[2],
  width: '100%',
  justifyItems: 'stretch',
});

export const barHeader = style({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: space[3],
});

export const barTrack = style({
  height: '0.5rem',
  overflow: 'hidden',
  borderRadius: radius.full,
  backgroundColor: color.border.subtle,
});

export const barFill = style({
  width: '100%',
  height: '100%',
  borderRadius: radius.full,
  backgroundColor: toneColor,
  transform: `translateX(calc((${progress} - 100) * 1%))`,
  transition: `transform ${motion.duration.base} ${motion.easing.standard}`,
});

/* StatusToggle */

export const toggleGroup = style({
  display: 'inline-flex',
  flexWrap: 'wrap',
  gap: space[1],
});

export const toggle = style([
  focusRing,
  {
    display: 'inline-flex',
    alignItems: 'center',
    gap: space[1],
    minHeight: '2rem',
    padding: `0 ${space[2]}`,
    border: `1px solid ${color.border.default}`,
    borderRadius: radius.md,
    backgroundColor: color.surface.raised,
    color: color.text.muted,
    fontSize: font.size.xs,
    fontWeight: font.weight.semibold,
    cursor: 'pointer',
    transition: `background-color ${transition}, border-color ${transition}, color ${transition}`,
    selectors: {
      '&:hover': { borderColor: color.border.strong, color: color.text.strong },
      '&[aria-pressed="true"]': {
        backgroundColor: color.action.ink,
        borderColor: color.action.ink,
        color: color.action.inkText,
      },
    },
  },
]);

globalStyle(`${toggle} svg`, { width: '0.9rem', height: '0.9rem' });

export const toggleIconOnly = style({
  width: '2rem',
  padding: 0,
  justifyContent: 'center',
});
