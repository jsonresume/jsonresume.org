import { globalStyle, keyframes, style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { focusRing, transition } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';

const { action, text, status } = vars.color;

export const button = recipe({
  base: [
    focusRing,
    {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: vars.space[2],
      border: '2px solid transparent',
      borderRadius: vars.radius.md,
      fontFamily: vars.font.family.sans,
      fontWeight: vars.font.weight.semibold,
      lineHeight: 1,
      letterSpacing: vars.font.tracking.caps,
      textTransform: 'uppercase',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      userSelect: 'none',
      transition: `background-color ${transition}, border-color ${transition}, color ${transition}`,
      selectors: {
        '&:disabled:not([aria-busy="true"]), &[aria-disabled="true"]': {
          cursor: 'not-allowed',
          opacity: 0.5,
        },
        // Loading is busy, not unavailable: keep full strength.
        '&[aria-busy="true"]': { cursor: 'progress' },
      },
    },
  ],
  variants: {
    variant: {
      primary: {
        backgroundColor: action.primary,
        borderColor: action.primary,
        color: action.primaryText,
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: action.primaryHover,
            borderColor: action.primaryHover,
          },
        },
      },
      secondary: {
        backgroundColor: action.neutral,
        borderColor: action.neutralBorder,
        color: action.neutralText,
        selectors: {
          '&:hover:not(:disabled)': {
            borderColor: action.neutralBorderHover,
            color: text.default,
          },
        },
      },
      ink: {
        backgroundColor: action.ink,
        borderColor: action.ink,
        color: action.inkText,
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: action.inkHover,
            borderColor: action.inkHover,
          },
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        // Inherit, so ghost buttons read on any surface (e.g. the yellow header).
        color: 'inherit',
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: vars.color.surface.muted,
          },
        },
      },
      danger: {
        backgroundColor: action.neutral,
        borderColor: status.danger,
        color: status.danger,
        selectors: {
          '&:hover:not(:disabled)': { backgroundColor: status.dangerSurface },
        },
      },
      link: {
        padding: 0,
        border: 0,
        backgroundColor: 'transparent',
        color: text.link,
        textTransform: 'none',
        letterSpacing: vars.font.tracking.normal,
        fontWeight: vars.font.weight.regular,
        textDecoration: 'underline',
        textUnderlineOffset: '3px',
        selectors: {
          '&:hover:not(:disabled)': { color: text.linkHover },
        },
      },
    },
    size: {
      sm: {
        fontSize: vars.font.size['2xs'],
        padding: `${vars.space[1]} ${vars.space[3]}`,
        minHeight: '2rem',
      },
      md: {
        fontSize: vars.font.size['2xs'],
        padding: `${vars.space[2]} ${vars.space[4]}`,
        minHeight: '2.25rem',
      },
      lg: {
        fontSize: vars.font.size.xs,
        padding: `${vars.space[3]} ${vars.space[6]}`,
        minHeight: '2.75rem',
      },
      icon: {
        padding: 0,
        width: '2.25rem',
        height: '2.25rem',
      },
    },
    fullWidth: {
      true: { width: '100%' },
    },
  },
  // Link buttons sit in running text: no box, and the surrounding font size.
  compoundVariants: (['sm', 'md', 'lg'] as const).map((size) => ({
    variants: { variant: 'link' as const, size },
    style: { minHeight: 0, padding: 0, fontSize: 'inherit' },
  })),
  defaultVariants: { variant: 'secondary', size: 'md' },
});

export type ButtonVariants = NonNullable<RecipeVariants<typeof button>>;

globalStyle(`${button.classNames.base} svg`, {
  width: '1em',
  height: '1em',
  flexShrink: 0,
});

const spin = keyframes({ to: { transform: 'rotate(360deg)' } });

export const spinner = style({
  width: '1em',
  height: '1em',
  borderRadius: '50%',
  border: '2px solid currentColor',
  borderRightColor: 'transparent',
  animation: `${spin} 0.7s linear infinite`,
});

// Opacity, not visibility: the label must stay in the accessible name.
export const hiddenLabel = style({ opacity: 0 });

export const spinnerSlot = style({
  position: 'absolute',
  inset: 0,
  display: 'grid',
  placeItems: 'center',
});
