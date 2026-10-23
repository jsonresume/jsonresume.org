import { keyframes, style } from '@vanilla-extract/css';
import { focusRing, transition } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';
import { media } from '../../tokens/theme';

const { color, font, space, radius, zIndex, shadow, motion } = vars;

const fadeIn = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const rise = keyframes({
  from: { opacity: 0, transform: 'translate(-50%, calc(-50% + 8px))' },
  to: { opacity: 1, transform: 'translate(-50%, -50%)' },
});

const reduced = { '@media': { [media.reducedMotion]: { animation: 'none' } } };

/* Dialog */

export const overlay = style({
  position: 'fixed',
  inset: 0,
  zIndex: zIndex.overlay,
  backgroundColor: color.overlay,
  animation: `${fadeIn} ${motion.duration.base} ${motion.easing.out}`,
  ...reduced,
});

export const dialog = style({
  position: 'fixed',
  insetBlockStart: '50%',
  insetInlineStart: '50%',
  zIndex: zIndex.modal,
  transform: 'translate(-50%, -50%)',
  display: 'grid',
  gap: space[4],
  width: `min(32rem, calc(100vw - ${space[8]}))`,
  maxHeight: `calc(100vh - ${space[8]})`,
  overflowY: 'auto',
  padding: space[6],
  border: `1px solid ${color.border.subtle}`,
  borderRadius: radius.lg,
  backgroundColor: color.surface.raised,
  color: color.text.default,
  boxShadow: shadow.lg,
  animation: `${rise} ${motion.duration.base} ${motion.easing.out}`,
  selectors: { '&:focus': { outline: 'none' } },
  ...reduced,
});

export const dialogTitle = style({
  margin: 0,
  paddingInlineEnd: space[8],
  color: color.text.strong,
  fontSize: font.size.xl,
  fontWeight: font.weight.regular,
  lineHeight: font.lineHeight.tight,
});

export const dialogDescription = style({
  margin: 0,
  color: color.text.muted,
  fontSize: font.size.sm,
});

export const dialogFooter = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  gap: space[2],
  marginBlockStart: space[2],
});

export const dialogClose = style([
  focusRing,
  {
    position: 'absolute',
    insetBlockStart: space[3],
    insetInlineEnd: space[3],
    display: 'grid',
    placeItems: 'center',
    width: '2rem',
    height: '2rem',
    border: 0,
    borderRadius: radius.md,
    background: 'transparent',
    color: color.text.muted,
    cursor: 'pointer',
    selectors: {
      '&:hover': {
        backgroundColor: color.surface.muted,
        color: color.text.strong,
      },
    },
  },
]);

/* Tooltip */

export const tooltip = style({
  zIndex: zIndex.tooltip,
  maxWidth: '18rem',
  padding: `${space[1]} ${space[2]}`,
  borderRadius: radius.md,
  backgroundColor: color.surface.inverse,
  color: color.text.inverse,
  fontSize: font.size.xs,
  lineHeight: font.lineHeight.snug,
  boxShadow: shadow.md,
  animation: `${fadeIn} ${motion.duration.fast} ${motion.easing.out}`,
  ...reduced,
});

export const tooltipArrow = style({ fill: color.surface.inverse });

/* Tabs: the underline style. */

export const tabsList = style({
  display: 'flex',
  gap: space[1],
  overflowX: 'auto',
  borderBlockEnd: `1px solid ${color.border.default}`,
});

export const tabsTrigger = style([
  focusRing,
  {
    flexShrink: 0,
    marginBlockEnd: '-1px',
    padding: `${space[3]} ${space[4]}`,
    border: 0,
    borderBlockEnd: '2px solid transparent',
    background: 'transparent',
    color: color.text.muted,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    cursor: 'pointer',
    transition: `color ${transition}, border-color ${transition}`,
    selectors: {
      '&:hover': { color: color.text.strong },
      '&[data-state="active"]': {
        color: color.text.strong,
        borderBlockEndColor: color.action.primary,
      },
      '&:disabled': { cursor: 'not-allowed', opacity: 0.5 },
    },
  },
]);

export const tabsContent = style([focusRing, { paddingBlock: space[5] }]);

/* Accordion */

export const accordionHeader = style({ margin: 0 });

export const accordionItem = style({
  borderBlockEnd: `1px solid ${color.border.default}`,
});

export const accordionTrigger = style([
  focusRing,
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[4],
    width: '100%',
    padding: `${space[4]} 0`,
    border: 0,
    background: 'transparent',
    color: color.text.strong,
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    textAlign: 'start',
    cursor: 'pointer',
    selectors: { '&:hover': { color: color.action.primaryHover } },
  },
]);

export const accordionChevron = style({
  flexShrink: 0,
  width: '1rem',
  height: '1rem',
  transition: `transform ${transition}`,
  selectors: {
    [`${accordionTrigger}[data-state="open"] &`]: {
      transform: 'rotate(180deg)',
    },
  },
});

export const accordionContent = style({
  overflow: 'hidden',
  color: color.text.default,
  fontSize: font.size.sm,
  lineHeight: font.lineHeight.normal,
});

export const accordionContentInner = style({ paddingBlockEnd: space[4] });

/* Breadcrumbs */

export const breadcrumbs = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: space[2],
  margin: 0,
  padding: 0,
  listStyle: 'none',
  color: color.text.muted,
  fontSize: font.size.xs,
});

export const breadcrumbItem = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: space[2],
});

export const breadcrumbSeparator = style({ color: color.border.strong });

/* NavList: the gray side navigation from jsonresume.org. */

export const navList = style({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  backgroundColor: color.surface.muted,
  borderRadius: radius.sm,
});

export const navGroupLabel = style({
  padding: `${space[4]} ${space[5]} ${space[1]}`,
  color: color.text.muted,
  fontSize: font.size['2xs'],
  fontWeight: font.weight.semibold,
  letterSpacing: font.tracking.caps,
  textTransform: 'uppercase',
});

export const navSubList = style({ margin: 0, padding: 0, listStyle: 'none' });

export const navItem = style({
  selectors: {
    '& + &': { borderBlockStart: `1px solid ${color.border.subtle}` },
  },
});

export const navItemLink = style([
  focusRing,
  {
    display: 'block',
    padding: `${space[3]} ${space[5]}`,
    color: color.text.strong,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    textDecoration: 'none',
    transition: `color ${transition}, background-color ${transition}`,
    selectors: {
      '&:hover': { color: color.action.primaryHover },
      '&[aria-current="page"]': {
        backgroundColor: color.surface.brand,
        color: color.text.onBrand,
      },
    },
  },
]);

/* CodeBlock: the bordered, labelled code panel from the schema page. */

export const codeBlock = style({
  overflow: 'hidden',
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.sm,
  backgroundColor: color.surface.raised,
});

export const codeHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[3],
  minHeight: '2.5rem',
  padding: `0 ${space[2]} 0 ${space[4]}`,
  borderBlockEnd: `1px solid ${color.border.default}`,
  backgroundColor: color.surface.subtle,
  color: color.text.muted,
  fontSize: font.size['2xs'],
  fontWeight: font.weight.semibold,
  letterSpacing: font.tracking.caps,
  textTransform: 'uppercase',
});

export const codePre = style({
  margin: 0,
  padding: space[4],
  overflowX: 'auto',
  color: color.text.default,
  fontFamily: font.family.mono,
  fontSize: font.size.xs,
  lineHeight: font.lineHeight.normal,
  tabSize: 2,
});

export const copyButton = style([
  focusRing,
  {
    display: 'inline-flex',
    alignItems: 'center',
    gap: space[1],
    padding: `${space[1]} ${space[2]}`,
    border: `1px solid transparent`,
    borderRadius: radius.md,
    background: 'transparent',
    color: color.text.muted,
    fontSize: font.size['2xs'],
    fontWeight: font.weight.semibold,
    letterSpacing: font.tracking.caps,
    textTransform: 'uppercase',
    cursor: 'pointer',
    selectors: {
      '&:hover': {
        borderColor: color.border.default,
        color: color.text.strong,
      },
    },
  },
]);
