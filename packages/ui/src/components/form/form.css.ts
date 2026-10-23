import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { transition } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';

const { color, font, space, radius } = vars;

export const field = style({ display: 'grid', gap: space[2], minWidth: 0 });

export const label = style({
  color: color.text.strong,
  fontSize: font.size.sm,
  fontWeight: font.weight.semibold,
  lineHeight: font.lineHeight.snug,
});

export const required = style({
  color: color.status.danger,
  marginInlineStart: '0.15em',
});

export const hint = style({
  margin: 0,
  color: color.text.muted,
  fontSize: font.size.xs,
  lineHeight: font.lineHeight.snug,
});

export const error = style([
  hint,
  { color: color.status.danger, fontWeight: font.weight.semibold },
]);

const control = {
  width: '100%',
  minWidth: 0,
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.sm,
  backgroundColor: color.surface.raised,
  color: color.text.default,
  fontFamily: font.family.sans,
  transition: `border-color ${transition}, box-shadow ${transition}`,
  selectors: {
    '&::placeholder': { color: color.text.muted, opacity: 1 },
    '&:hover:not(:disabled)': { borderColor: color.border.strong },
    '&:focus-visible': {
      outline: 'none',
      borderColor: color.focus,
      boxShadow: `0 0 0 1px ${color.focus}`,
    },
    '&[aria-invalid="true"]': { borderColor: color.status.danger },
    '&[aria-invalid="true"]:focus-visible': {
      boxShadow: `0 0 0 1px ${color.status.danger}`,
    },
    '&:disabled': {
      cursor: 'not-allowed',
      backgroundColor: color.surface.muted,
      opacity: 0.7,
    },
  },
} as const;

export const input = recipe({
  base: control,
  variants: {
    size: {
      sm: {
        fontSize: font.size.sm,
        padding: `${space[1]} ${space[2]}`,
        minHeight: '2rem',
      },
      md: {
        fontSize: font.size.sm,
        padding: `${space[2]} ${space[3]}`,
        minHeight: '2.5rem',
      },
      // The large search field from the jsonresume.org docs.
      lg: {
        fontSize: font.size.xl,
        padding: `${space[4]} ${space[5]}`,
        minHeight: '3.75rem',
      },
    },
  },
  defaultVariants: { size: 'md' },
});

export const textarea = style([
  control,
  {
    fontSize: font.size.sm,
    lineHeight: font.lineHeight.normal,
    padding: `${space[2]} ${space[3]}`,
    minHeight: '6rem',
    resize: 'vertical',
  },
]);

export const select = style([
  control,
  {
    appearance: 'none',
    fontSize: font.size.sm,
    padding: `${space[2]} ${space[8]} ${space[2]} ${space[3]}`,
    minHeight: '2.5rem',
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2.5 4.5 6 8l3.5-3.5' fill='none' stroke='%236b6b6b' stroke-width='1.5'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: `right ${space[3]} center`,
    cursor: 'pointer',
  },
]);

const box = {
  display: 'inline-grid',
  placeItems: 'center',
  flexShrink: 0,
  width: '1.125rem',
  height: '1.125rem',
  border: `2px solid ${color.border.strong}`,
  backgroundColor: color.surface.raised,
  color: color.action.inkText,
  cursor: 'pointer',
  transition: `background-color ${transition}, border-color ${transition}`,
} as const;

export const checkbox = style({
  ...box,
  borderRadius: radius.sm,
  selectors: {
    '&:hover:not(:disabled)': { borderColor: color.text.muted },
    '&:focus-visible': {
      outline: `2px solid ${color.focus}`,
      outlineOffset: '2px',
    },
    '&[data-state="checked"], &[data-state="indeterminate"]': {
      backgroundColor: color.action.ink,
      borderColor: color.action.ink,
    },
    '&:disabled': { cursor: 'not-allowed', opacity: 0.5 },
  },
});

export const checkIcon = style({ width: '0.75rem', height: '0.75rem' });

export const inlineLabel = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: space[2],
  color: color.text.default,
  fontSize: font.size.sm,
  lineHeight: font.lineHeight.snug,
  cursor: 'pointer',
});

export const switchRoot = style({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
  width: '2.25rem',
  height: '1.25rem',
  padding: '2px',
  border: 0,
  borderRadius: radius.full,
  backgroundColor: color.border.strong,
  cursor: 'pointer',
  transition: `background-color ${transition}`,
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${color.focus}`,
      outlineOffset: '2px',
    },
    '&[data-state="checked"]': { backgroundColor: color.action.ink },
    '&:disabled': { cursor: 'not-allowed', opacity: 0.5 },
  },
});

export const switchThumb = style({
  display: 'block',
  width: '1rem',
  height: '1rem',
  borderRadius: radius.full,
  backgroundColor: color.surface.raised,
  boxShadow: vars.shadow.sm,
  transition: `transform ${transition}`,
  selectors: { '&[data-state="checked"]': { transform: 'translateX(1rem)' } },
});
