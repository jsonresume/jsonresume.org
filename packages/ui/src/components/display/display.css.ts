import { keyframes, style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { vars } from '../../tokens/contract.css';

const { color, font, space, radius } = vars;

/* Badge */

export const badge = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: space[1],
    padding: `0.15rem ${space[2]}`,
    border: '1px solid transparent',
    borderRadius: radius.sm,
    fontSize: font.size.xs,
    fontWeight: font.weight.semibold,
    lineHeight: font.lineHeight.snug,
    whiteSpace: 'nowrap',
  },
  variants: {
    tone: {
      neutral: {
        backgroundColor: color.surface.muted,
        color: color.text.default,
      },
      brand: {
        backgroundColor: color.surface.brand,
        color: color.text.onBrand,
      },
      outline: { borderColor: color.border.default, color: color.text.default },
      info: {
        backgroundColor: color.status.infoSurface,
        color: color.status.info,
      },
      success: {
        backgroundColor: color.status.successSurface,
        color: color.status.success,
      },
      warning: {
        backgroundColor: color.status.warningSurface,
        color: color.status.warning,
      },
      danger: {
        backgroundColor: color.status.dangerSurface,
        color: color.status.danger,
      },
    },
  },
  defaultVariants: { tone: 'neutral' },
});

export type BadgeVariants = NonNullable<RecipeVariants<typeof badge>>;

/* Callout */

export const callout = recipe({
  base: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    columnGap: space[3],
    padding: space[4],
    borderInlineStart: '3px solid',
    borderRadius: radius.sm,
    fontSize: font.size.sm,
    lineHeight: font.lineHeight.normal,
    color: color.text.default,
  },
  variants: {
    tone: {
      note: {
        backgroundColor: color.surface.subtle,
        borderColor: color.border.strong,
      },
      brand: {
        backgroundColor: color.surface.brandSubtle,
        borderColor: color.surface.brand,
      },
      info: {
        backgroundColor: color.status.infoSurface,
        borderColor: color.status.info,
      },
      success: {
        backgroundColor: color.status.successSurface,
        borderColor: color.status.success,
      },
      warning: {
        backgroundColor: color.status.warningSurface,
        borderColor: color.status.warning,
      },
      danger: {
        backgroundColor: color.status.dangerSurface,
        borderColor: color.status.danger,
      },
    },
  },
  defaultVariants: { tone: 'note' },
});

export const calloutIcon = style({
  width: '1.125rem',
  height: '1.125rem',
  marginBlockStart: '0.1rem',
});
export const calloutBody = style({
  display: 'grid',
  gap: space[1],
  minWidth: 0,
  gridColumn: 2,
  selectors: { '&:only-child': { gridColumn: '1 / -1' } },
});
export const calloutTitle = style({
  margin: 0,
  fontWeight: font.weight.semibold,
  color: color.text.strong,
});

/* Spinner, Skeleton, Progress */

const spin = keyframes({ to: { transform: 'rotate(360deg)' } });

export const spinner = style({
  display: 'inline-block',
  width: '1.25rem',
  height: '1.25rem',
  borderRadius: '50%',
  border: `2px solid ${color.border.default}`,
  borderTopColor: color.text.strong,
  animation: `${spin} 0.8s linear infinite`,
});

const pulse = keyframes({ '50%': { opacity: 0.5 } });

export const skeleton = style({
  display: 'block',
  borderRadius: radius.sm,
  backgroundColor: color.surface.muted,
  animation: `${pulse} 1.6s ${vars.motion.easing.standard} infinite`,
});

export const progress = style({
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  height: '0.5rem',
  borderRadius: radius.full,
  backgroundColor: color.surface.muted,
});

// Full-width bar moved with a transform, so value changes never trigger layout.
export const progressBar = style({
  width: '100%',
  height: '100%',
  backgroundColor: color.action.ink,
  borderRadius: radius.full,
  transition: `transform ${vars.motion.duration.base} ${vars.motion.easing.standard}`,
});

/* EmptyState */

export const emptyState = style({
  display: 'grid',
  justifyItems: 'center',
  gap: space[3],
  padding: `${space[12]} ${space[6]}`,
  border: `1px dashed ${color.border.default}`,
  borderRadius: radius.sm,
  textAlign: 'center',
});

export const emptyIcon = style({
  color: color.text.muted,
  width: '2rem',
  height: '2rem',
});
export const emptyTitle = style({
  margin: 0,
  fontSize: font.size.xl,
  fontWeight: font.weight.light,
  color: color.text.strong,
});
export const emptyText = style({
  maxWidth: '42ch',
  color: color.text.muted,
  fontSize: font.size.sm,
});

/* Card: the bordered tiles used across jsonresume.org. */

export const card = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    borderRadius: radius.sm,
    color: color.text.default,
  },
  variants: {
    tone: {
      outline: {
        backgroundColor: color.surface.raised,
        border: `1px solid ${color.border.default}`,
      },
      subtle: {
        backgroundColor: color.surface.subtle,
        border: `1px solid ${color.border.subtle}`,
      },
      raised: {
        backgroundColor: color.surface.raised,
        border: `1px solid ${color.border.subtle}`,
        boxShadow: vars.shadow.md,
      },
      // Irreversible actions ("Delete account"): set apart, never alone in
      // colour; the heading and button say what happens.
      danger: {
        backgroundColor: color.surface.raised,
        border: `1px solid ${color.status.danger}`,
      },
    },
    interactive: {
      true: {
        transition: `border-color ${vars.motion.duration.base} ${vars.motion.easing.standard}`,
        selectors: { '&:hover': { borderColor: color.border.strong } },
      },
    },
  },
  defaultVariants: { tone: 'outline' },
});

export type CardVariants = NonNullable<RecipeVariants<typeof card>>;

export const cardHeader = style({
  display: 'grid',
  gap: space[1],
  padding: `${space[5]} ${space[5]} 0`,
});
export const cardTitle = style({
  margin: 0,
  color: color.text.strong,
  fontSize: font.size.lg,
  fontWeight: font.weight.semibold,
  lineHeight: font.lineHeight.snug,
});
export const cardDescription = style({
  margin: 0,
  color: color.text.muted,
  fontSize: font.size.sm,
});
export const cardContent = style({ padding: space[5], flexGrow: 1 });
export const cardFooter = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[2],
  padding: `${space[3]} ${space[5]}`,
  borderBlockStart: `1px solid ${color.border.subtle}`,
});
export const cardMedia = style({
  display: 'block',
  overflow: 'hidden',
  borderBlockEnd: `1px solid ${color.border.subtle}`,
  borderStartStartRadius: radius.sm,
  borderStartEndRadius: radius.sm,
});

/* Table */

export const tableWrap = style({ width: '100%', overflowX: 'auto' });
export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: font.size.sm,
  color: color.text.default,
});
export const th = style({
  padding: `${space[2]} ${space[3]}`,
  borderBlockEnd: `2px solid ${color.border.default}`,
  textAlign: 'start',
  color: color.text.muted,
  fontSize: font.size['2xs'],
  fontWeight: font.weight.semibold,
  letterSpacing: font.tracking.caps,
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
});
export const td = style({
  padding: `${space[3]} ${space[3]}`,
  borderBlockEnd: `1px solid ${color.border.subtle}`,
  verticalAlign: 'top',
});
export const caption = style({
  captionSide: 'bottom',
  paddingBlockStart: space[3],
  color: color.text.muted,
  fontSize: font.size.xs,
  textAlign: 'start',
});

/* Avatar */

export const avatar = recipe({
  base: {
    display: 'inline-grid',
    placeItems: 'center',
    flexShrink: 0,
    overflow: 'hidden',
    borderRadius: radius.sm,
    backgroundColor: color.surface.muted,
    color: color.text.muted,
    fontWeight: font.weight.semibold,
    verticalAlign: 'middle',
  },
  variants: {
    size: {
      sm: { width: '2rem', height: '2rem', fontSize: font.size.xs },
      md: { width: '3rem', height: '3rem', fontSize: font.size.sm },
      lg: { width: '5rem', height: '5rem', fontSize: font.size.xl },
    },
    shape: {
      square: {},
      circle: { borderRadius: radius.full },
    },
  },
  defaultVariants: { size: 'md', shape: 'square' },
});

export const avatarImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});
