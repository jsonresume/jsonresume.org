import { media, vars } from '@jsonresume/ui/tokens';
import {
  createVar,
  keyframes,
  style,
  styleVariants,
} from '@vanilla-extract/css';

/** How full a meter's bar is. */
export const barWidth = createVar();

const rise = keyframes({
  from: { opacity: 0, transform: 'translateY(6px)' },
  to: { opacity: 1, transform: 'none' },
});

/** The verdicts as big tabs: a phone shows two a row, a desktop four. */
export const tabs = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: vars.space[2],
  '@media': {
    [media.md]: { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
  },
});

export const tab = style({
  display: 'grid',
  gap: vars.space[1],
  textAlign: 'left',
  padding: `${vars.space[3]} ${vars.space[4]}`,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border.default}`,
  background: vars.color.surface.raised,
  boxShadow: vars.shadow.sm,
  cursor: 'pointer',
  font: 'inherit',
  color: vars.color.text.default,
  transition: `transform ${vars.motion.duration.base} ${vars.motion.easing.out}, box-shadow ${vars.motion.duration.base} ${vars.motion.easing.out}, border-color ${vars.motion.duration.fast}`,
  selectors: {
    '&:hover': { transform: 'translateY(-1px)', boxShadow: vars.shadow.md },
    '&[aria-pressed="true"]': {
      borderColor: vars.color.text.strong,
      boxShadow: `inset 0 0 0 1px ${vars.color.text.strong}, ${vars.shadow.md}`,
    },
    '&:focus-visible': {
      outline: `2px solid ${vars.color.action.primary}`,
      outlineOffset: '2px',
    },
  },
  '@media': { '(prefers-reduced-motion: reduce)': { transition: 'none' } },
});

export const tabCount = style({
  fontSize: vars.font.size['2xl'],
  fontWeight: vars.font.weight.semibold,
  letterSpacing: vars.font.tracking.tight,
  lineHeight: vars.font.lineHeight.tight,
  color: vars.color.text.strong,
});

export const tabName = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  fontWeight: vars.font.weight.semibold,
  fontSize: vars.font.size.sm,
});

export const tabHint = style({
  fontSize: vars.font.size.xs,
  color: vars.color.text.muted,
});

/** The verdict's colour, on its dot and badge. */
export const tone = styleVariants({
  apply: { background: vars.color.status.success },
  stretch: { background: vars.color.status.info },
  skip: { background: vars.color.text.muted },
  ruled_out: { background: vars.color.status.danger },
});

export const dot = style({
  width: '8px',
  height: '8px',
  borderRadius: vars.radius.full,
  flexShrink: 0,
});

/** The marked views: a quieter row under the verdicts. */
export const marked = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[2],
});

export const card = style({
  animation: `${rise} ${vars.motion.duration.slow} ${vars.motion.easing.out} both`,
});

/** Chance and appeal beside a job: two labelled bars. */
export const meters = style({
  display: 'grid',
  gap: vars.space[2],
  minWidth: '9.5rem',
  width: '100%',
  '@media': { [media.md]: { width: '10.5rem' } },
});

export const meter = style({ display: 'grid', gap: '3px' });

export const meterLabel = style({
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: vars.font.size.xs,
  color: vars.color.text.muted,
});

export const meterValue = style({
  color: vars.color.text.strong,
  fontWeight: vars.font.weight.semibold,
});

export const track = style({
  height: '6px',
  borderRadius: vars.radius.full,
  background: vars.color.surface.muted,
  overflow: 'hidden',
});

export const fill = style({
  width: barWidth,
  height: '100%',
  borderRadius: vars.radius.full,
  transition: `width ${vars.motion.duration.slow} ${vars.motion.easing.out}`,
});

export const fillTone = styleVariants({
  chance: { background: vars.color.chart.series1 },
  appeal: { background: vars.color.chart.series2 },
});

/** Why: one line each, marked good, bad or a note. */
export const reasons = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'grid',
  gap: '2px',
  fontSize: vars.font.size.sm,
});

export const reason = style({
  display: 'flex',
  gap: vars.space[2],
  alignItems: 'baseline',
});

export const mark = styleVariants({
  good: { color: vars.color.status.success, fontWeight: vars.font.weight.bold },
  bad: { color: vars.color.status.danger, fontWeight: vars.font.weight.bold },
  note: { color: vars.color.text.muted },
});

export const why = style({
  color: vars.color.text.muted,
  fontStyle: 'italic',
  fontSize: vars.font.size.sm,
});

export const actions = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: vars.space[1],
  width: '100%',
  '@media': { [media.md]: { display: 'flex', width: 'auto' } },
});

export const roleLabel = style({
  fontSize: vars.font.size.xs,
  fontWeight: vars.font.weight.semibold,
  color: vars.color.text.default,
});

export const gapLink = style({
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold,
  color: vars.color.text.link,
  textDecoration: 'none',
  selectors: { '&:hover': { textDecoration: 'underline' } },
});

export const verdictBadge = style({
  justifySelf: 'start',
  alignSelf: 'flex-start',
});
