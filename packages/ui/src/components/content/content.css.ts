import { style } from '@vanilla-extract/css';
import { focusRing, transition } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';
import { media } from '../../tokens/theme';

const { color, font, space, radius } = vars;

/* SectionIntro */
export const intro = style({
  display: 'grid',
  gap: space[3],
  maxWidth: '40rem',
  marginBlockEnd: space[10],
});

export const introCenter = style({ marginInline: 'auto', textAlign: 'center' });

export const overline = style({
  margin: 0,
  color: color.text.muted,
  fontSize: font.size['2xs'],
  fontWeight: font.weight.semibold,
  letterSpacing: font.tracking.caps,
  textTransform: 'uppercase',
});

export const introTitle = style({
  margin: 0,
  color: color.text.strong,
  fontSize: font.size['2xl'],
  fontWeight: font.weight.light,
  lineHeight: font.lineHeight.tight,
  '@media': { [media.md]: { fontSize: font.size['3xl'] } },
});

export const introLede = style({
  margin: 0,
  color: color.text.default,
  fontSize: font.size.md,
  lineHeight: font.lineHeight.normal,
});

/* LinkCard */
export const linkCard = style([
  focusRing,
  {
    position: 'relative',
    display: 'grid',
    alignContent: 'start',
    gap: space[2],
    height: '100%',
    padding: space[5],
    border: `1px solid ${color.border.default}`,
    borderRadius: radius.md,
    backgroundColor: color.surface.raised,
    color: color.text.default,
    textDecoration: 'none',
    transition: `border-color ${transition}, transform ${transition}`,
    selectors: {
      '&:hover': { borderColor: color.border.strong },
      '&:active': { transform: 'translateY(1px)' },
    },
  },
]);

export const linkCardEyebrow = overline;

export const linkCardTitle = style({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: space[3],
  color: color.text.strong,
  fontSize: font.size.md,
  fontWeight: font.weight.semibold,
  lineHeight: font.lineHeight.snug,
});

export const linkCardArrow = style({
  flexShrink: 0,
  color: color.text.muted,
  transition: `transform ${transition}, color ${transition}`,
  selectors: {
    [`${linkCard}:hover &`]: {
      color: color.text.link,
      transform: 'translateX(2px)',
    },
  },
});

export const linkCardText = style({
  color: color.text.default,
  fontSize: font.size.sm,
  lineHeight: font.lineHeight.normal,
});

export const linkCardMeta = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[2],
  marginBlockStart: space[1],
});

/* OnThisPage */
export const toc = style({
  display: 'grid',
  gap: space[3],
  '@media': { [media.lg]: { position: 'sticky', insetBlockStart: space[6] } },
});

export const tocList = style({
  display: 'grid',
  gap: space[1],
  margin: 0,
  padding: 0,
  listStyle: 'none',
  borderInlineStart: `2px solid ${color.border.subtle}`,
});

export const tocLink = style([
  focusRing,
  {
    display: 'block',
    marginInlineStart: '-2px',
    paddingBlock: space[1],
    paddingInlineStart: space[3],
    borderInlineStart: '2px solid transparent',
    color: color.text.muted,
    fontSize: font.size.xs,
    textDecoration: 'none',
    '@media': { [media.coarse]: { paddingBlock: space[2] } },
    selectors: {
      '&:hover': { color: color.text.strong },
      '&[aria-current="true"]': {
        borderInlineStartColor: color.action.primary,
        color: color.text.strong,
        fontWeight: font.weight.semibold,
      },
    },
  },
]);

/* ChipGroup */
export const chips = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[2],
});

export const choice = style([
  focusRing,
  {
    display: 'inline-flex',
    alignItems: 'center',
    gap: space[1],
    paddingBlock: space[1],
    paddingInline: space[3],
    border: `1px solid ${color.border.default}`,
    borderRadius: radius.full,
    backgroundColor: color.surface.raised,
    color: color.text.default,
    fontFamily: 'inherit',
    fontSize: font.size.xs,
    cursor: 'pointer',
    transition: `border-color ${transition}, background-color ${transition}`,
    '@media': { [media.coarse]: { minHeight: '2.5rem' } },
    selectors: {
      '&:hover': { borderColor: color.border.strong },
      '&[aria-pressed="true"]': {
        borderColor: color.action.ink,
        backgroundColor: color.action.ink,
        color: color.action.inkText,
      },
    },
  },
]);

export const choiceCount = style({
  opacity: 0.7,
  fontVariantNumeric: 'tabular-nums',
});

/* CodeTabs */
// One shrinkable column: long code lines scroll inside the block instead of
// widening the page.
export const codeTabs = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: space[2],
});
