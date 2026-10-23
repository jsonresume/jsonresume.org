import { globalStyle, style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { focusRing, transition } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';

const { font } = vars;

/**
 * Heading sizes follow jsonresume.org: large titles are light (300), smaller
 * ones step up in weight so they stay legible.
 */
export const heading = recipe({
  base: {
    margin: 0,
    color: vars.color.text.strong,
    fontFamily: font.family.sans,
    lineHeight: font.lineHeight.tight,
    textWrap: 'balance',
  },
  variants: {
    size: {
      display: {
        fontSize: font.size['4xl'],
        fontWeight: font.weight.light,
        letterSpacing: '-0.01em',
      },
      title: { fontSize: font.size['3xl'], fontWeight: font.weight.light },
      section: { fontSize: font.size['2xl'], fontWeight: font.weight.light },
      subsection: { fontSize: font.size.xl, fontWeight: font.weight.regular },
      group: { fontSize: font.size.lg, fontWeight: font.weight.semibold },
      label: {
        fontSize: font.size.md,
        fontWeight: font.weight.semibold,
        lineHeight: font.lineHeight.snug,
      },
    },
  },
  defaultVariants: { size: 'section' },
});

export type HeadingVariants = NonNullable<RecipeVariants<typeof heading>>;

export const text = recipe({
  base: { margin: 0, fontFamily: font.family.sans },
  variants: {
    size: {
      xs: { fontSize: font.size.xs, lineHeight: font.lineHeight.snug },
      sm: { fontSize: font.size.sm, lineHeight: font.lineHeight.normal },
      md: { fontSize: font.size.md, lineHeight: font.lineHeight.normal },
      lg: { fontSize: font.size.lg, lineHeight: font.lineHeight.normal },
    },
    tone: {
      default: { color: vars.color.text.default },
      strong: { color: vars.color.text.strong },
      muted: { color: vars.color.text.muted },
      inherit: { color: 'inherit' },
    },
    weight: {
      light: { fontWeight: font.weight.light },
      regular: { fontWeight: font.weight.regular },
      semibold: { fontWeight: font.weight.semibold },
      bold: { fontWeight: font.weight.bold },
    },
    caps: {
      true: {
        fontSize: font.size['2xs'],
        fontWeight: font.weight.semibold,
        letterSpacing: font.tracking.caps,
        textTransform: 'uppercase',
      },
    },
    measure: {
      true: { maxWidth: vars.layout.prose },
    },
  },
  defaultVariants: { size: 'sm', tone: 'default', weight: 'regular' },
});

export type TextVariants = NonNullable<RecipeVariants<typeof text>>;

export const link = recipe({
  base: [
    focusRing,
    {
      color: vars.color.text.link,
      textDecoration: 'underline',
      textDecorationThickness: '1px',
      textUnderlineOffset: '3px',
      borderRadius: vars.radius.sm,
      transition: `color ${transition}`,
      selectors: { '&:hover': { color: vars.color.text.linkHover } },
    },
  ],
  variants: {
    tone: {
      brand: {},
      // Quiet links: navigation, footers, lists of links.
      neutral: {
        color: vars.color.text.default,
        textDecoration: 'none',
        selectors: {
          '&:hover': {
            color: vars.color.action.primaryHover,
            textDecoration: 'underline',
          },
        },
      },
    },
  },
  defaultVariants: { tone: 'brand' },
});

export type LinkVariants = NonNullable<RecipeVariants<typeof link>>;

export const externalIcon = style({
  display: 'inline-block',
  marginInlineStart: '0.2em',
  width: '0.75em',
  height: '0.75em',
  verticalAlign: 'baseline',
});

export const code = style({
  fontFamily: font.family.mono,
  fontSize: '0.9em',
  padding: '0.1em 0.35em',
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.surface.muted,
  color: vars.color.text.strong,
  overflowWrap: 'anywhere',
});

export const kbd = style({
  fontFamily: font.family.mono,
  fontSize: '0.8em',
  padding: '0.1em 0.4em',
  border: `1px solid ${vars.color.border.default}`,
  borderBottomWidth: '2px',
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.surface.raised,
  color: vars.color.text.default,
  whiteSpace: 'nowrap',
});

/** Long-form content: docs, posts, guides. Styles plain HTML children. */
export const prose = style({
  maxWidth: vars.layout.prose,
  color: vars.color.text.default,
  fontSize: font.size.md,
  lineHeight: font.lineHeight.normal,
});

const p = (selector: string) => `${prose} ${selector}`;

globalStyle(p('> * + *'), { marginBlockStart: '1em' });
globalStyle(p(':where(h2)'), {
  marginBlockStart: '2em',
  fontSize: font.size['2xl'],
  fontWeight: font.weight.light,
  lineHeight: font.lineHeight.tight,
  color: vars.color.text.strong,
});
globalStyle(p(':where(h3)'), {
  marginBlockStart: '1.6em',
  fontSize: font.size.xl,
  fontWeight: font.weight.regular,
  lineHeight: font.lineHeight.tight,
  color: vars.color.text.strong,
});
globalStyle(p(':where(h4)'), {
  marginBlockStart: '1.4em',
  fontSize: font.size.md,
  fontWeight: font.weight.semibold,
  color: vars.color.text.strong,
});
globalStyle(p(':where(h2, h3, h4) + *'), { marginBlockStart: '0.6em' });
globalStyle(p(':where(ul, ol)'), { paddingInlineStart: '1.4em' });
globalStyle(p(':where(li + li)'), { marginBlockStart: '0.3em' });
globalStyle(p(':where(a)'), {
  color: vars.color.text.link,
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
});
globalStyle(p(':where(a:hover)'), { color: vars.color.text.linkHover });
globalStyle(p(':where(:not(pre) > code)'), {
  fontFamily: font.family.mono,
  fontSize: '0.9em',
  padding: '0.1em 0.35em',
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.surface.muted,
  color: vars.color.text.strong,
});
globalStyle(p(':where(pre)'), {
  overflowX: 'auto',
  padding: vars.space[4],
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.surface.subtle,
  fontFamily: font.family.mono,
  fontSize: font.size.sm,
  lineHeight: font.lineHeight.snug,
});
globalStyle(p(':where(blockquote)'), {
  margin: 0,
  paddingInlineStart: vars.space[4],
  borderInlineStart: `3px solid ${vars.color.surface.brand}`,
  color: vars.color.text.muted,
});
globalStyle(p(':where(hr)'), {
  border: 0,
  borderBlockStart: `1px solid ${vars.color.border.default}`,
  marginBlock: '2em',
});
globalStyle(p(':where(table)'), {
  borderCollapse: 'collapse',
  width: '100%',
  fontSize: font.size.sm,
});
globalStyle(p(':where(th, td)'), {
  textAlign: 'start',
  padding: `${vars.space[2]} ${vars.space[3]}`,
  borderBlockEnd: `1px solid ${vars.color.border.default}`,
});
globalStyle(p(':where(img)'), { maxWidth: '100%', height: 'auto' });
// GitHub task lists: the checkbox replaces the bullet.
globalStyle(p(':where(.contains-task-list)'), {
  listStyle: 'none',
  paddingInlineStart: 0,
});
