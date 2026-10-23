import { globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { focusRing, transition } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';

const { color, font, space, radius } = vars;

/* StatTile */

export const stat = style({
  display: 'grid',
  alignContent: 'start',
  gap: space[1],
  padding: space[5],
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.sm,
  backgroundColor: color.surface.raised,
});

export const statLabel = style({
  margin: 0,
  color: color.text.muted,
  fontSize: font.size['2xs'],
  fontWeight: font.weight.semibold,
  letterSpacing: font.tracking.caps,
  textTransform: 'uppercase',
});

export const statValue = style({
  margin: 0,
  color: color.text.strong,
  fontSize: font.size['3xl'],
  fontWeight: font.weight.light,
  lineHeight: font.lineHeight.tight,
  fontVariantNumeric: 'tabular-nums',
});

export const statUnit = style({
  marginInlineStart: '0.15em',
  color: color.text.muted,
  fontSize: font.size.lg,
});

export const trend = recipe({
  base: { margin: 0, fontSize: font.size.xs, fontWeight: font.weight.semibold },
  variants: {
    tone: {
      good: { color: color.status.success },
      bad: { color: color.status.danger },
      neutral: { color: color.text.muted },
    },
  },
});

export const statNote = style({
  margin: 0,
  color: color.text.muted,
  fontSize: font.size.xs,
});

/* DescriptionList */

export const dl = recipe({
  base: { margin: 0, fontSize: font.size.sm },
  variants: {
    layout: {
      stacked: { display: 'grid', gap: space[3] },
      inline: {
        display: 'grid',
        gridTemplateColumns: 'minmax(7rem, max-content) minmax(0, 1fr)',
        gap: `${space[2]} ${space[6]}`,
      },
      columns: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(10rem, 100%), 1fr))',
        gap: space[4],
      },
    },
  },
  defaultVariants: { layout: 'inline' },
});

export const dlItem = style({ display: 'contents' });

export const dt = style({ margin: 0, color: color.text.muted });

export const dd = style({
  margin: 0,
  color: color.text.strong,
  minWidth: 0,
  overflowWrap: 'anywhere',
});

globalStyle(
  `${dl.classNames.variants.layout.stacked} ${dlItem}, ${dl.classNames.variants.layout.columns} ${dlItem}`,
  {
    display: 'grid',
    gap: space[1],
  }
);

globalStyle(
  `${dl.classNames.variants.layout.stacked} ${dt}, ${dl.classNames.variants.layout.columns} ${dt}`,
  {
    fontSize: font.size['2xs'],
    fontWeight: font.weight.semibold,
    letterSpacing: font.tracking.caps,
    textTransform: 'uppercase',
  }
);

/* Entity cards (job, person) */

export const entity = style({
  position: 'relative',
  display: 'grid',
  gap: space[3],
  padding: space[5],
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.sm,
  backgroundColor: color.surface.raised,
  transition: `border-color ${transition}`,
  selectors: { '&:hover': { borderColor: color.border.strong } },
});

export const entityHeader = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: space[3],
});

export const entityTitleWrap = style({
  display: 'grid',
  gap: '2px',
  flex: 1,
  minWidth: 0,
});

export const entityTitle = style({
  margin: 0,
  color: color.text.strong,
  fontSize: font.size.md,
  fontWeight: font.weight.semibold,
  lineHeight: font.lineHeight.snug,
});

/** Stretched link: the whole card is clickable through the title link. */
export const entityLink = style([
  focusRing,
  {
    color: 'inherit',
    textDecoration: 'none',
    selectors: {
      '&::after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        borderRadius: radius.sm,
      },
      '&:hover': { textDecoration: 'underline', textUnderlineOffset: '3px' },
      '&:focus-visible': { outline: 'none' },
      '&:focus-visible::after': {
        outline: `2px solid ${color.focus}`,
        outlineOffset: '2px',
      },
    },
  },
]);

export const entitySubtitle = style({
  margin: 0,
  color: color.text.default,
  fontSize: font.size.sm,
});

export const entityMeta = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: `${space[1]} ${space[3]}`,
  margin: 0,
  padding: 0,
  listStyle: 'none',
  color: color.text.muted,
  fontSize: font.size.xs,
});

export const entityTags = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[1],
});

/** Footer controls sit above the stretched link. */
export const entityActions = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: space[2],
});

export const match = style({
  flexShrink: 0,
  display: 'grid',
  justifyItems: 'end',
  color: color.status.success,
  fontSize: font.size.xs,
  fontWeight: font.weight.semibold,
  lineHeight: 1.1,
});

export const matchNumber = style({
  fontSize: font.size.xl,
  fontWeight: font.weight.light,
  fontVariantNumeric: 'tabular-nums',
});

/* Checklist */

export const checklist = style({
  display: 'grid',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const checkItem = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  gap: `2px ${space[3]}`,
  paddingBlock: space[3],
  selectors: {
    '& + &': { borderBlockStart: `1px solid ${color.border.subtle}` },
  },
});

export const checkIcon = recipe({
  base: {
    gridRow: '1 / span 2',
    width: '1.25rem',
    height: '1.25rem',
    marginBlockStart: '1px',
  },
  variants: {
    status: {
      pass: { color: color.status.success },
      warn: { color: color.status.warning },
      fail: { color: color.status.danger },
    },
  },
});

export const checkTitle = style({
  margin: 0,
  color: color.text.strong,
  fontSize: font.size.sm,
  fontWeight: font.weight.semibold,
});

export const checkText = style({
  gridColumn: 2,
  margin: 0,
  color: color.text.muted,
  fontSize: font.size.sm,
});

export const checklistSummary = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[2],
  marginBlockEnd: space[2],
});

/* SecretField */

export const secret = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[2],
  padding: `${space[1]} ${space[1]} ${space[1]} ${space[3]}`,
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.sm,
  backgroundColor: color.surface.subtle,
});

export const secretValue = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: color.text.strong,
  fontFamily: font.family.mono,
  fontSize: font.size.sm,
});
