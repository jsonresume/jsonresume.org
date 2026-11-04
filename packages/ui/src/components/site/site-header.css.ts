import { globalStyle, keyframes, style } from '@vanilla-extract/css';
import { onBrandVars } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';
import { breakpoints, media } from '../../tokens/theme';

const { color, space, motion } = vars;

/** Below lg the links fold into the menu. */
const narrow = `screen and (max-width: ${breakpoints.lg - 0.02}px)`;
const still = '(prefers-reduced-motion: reduce)';
/** The bar's height below lg; the open menu grows down from it. */
const bar = '4rem';

// The yellow band grows down to fill the screen, and folds back up.
const grow = keyframes({
  from: { clipPath: `inset(0 0 calc(100% - ${bar}) 0)` },
  to: { clipPath: 'inset(0)' },
});
const fold = keyframes({
  from: { clipPath: 'inset(0)' },
  to: { clipPath: `inset(0 0 calc(100% - ${bar}) 0)` },
});
const rise = keyframes({
  from: { opacity: 0, transform: 'translateY(0.75rem)' },
  to: { opacity: 1, transform: 'none' },
});
const fade = keyframes({ to: { opacity: 0 } });

/* SiteHeader: the yellow navigation band. */
export const header = style({
  position: 'relative',
  backgroundColor: color.surface.brand,
  color: color.text.onBrand,
  vars: onBrandVars,
  viewTransitionName: 'site-header',
  selectors: {
    // Named for page transitions, the header stacks on its own: lift it
    // over the page while its menu covers the screen.
    '&:is([data-state="open"], [data-state="closing"])': {
      zIndex: vars.zIndex.modal,
    },
  },
  // Keeps its place in the page while the open menu is fixed over it.
  '@media': { [narrow]: { minHeight: bar } },
});

export const headerBar = style({
  '@media': {
    [narrow]: {
      selectors: {
        [`${header}:is([data-state="open"], [data-state="closing"]) &`]: {
          position: 'fixed',
          inset: 0,
          zIndex: vars.zIndex.modal,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          backgroundColor: color.surface.brand,
          animation: `${grow} ${motion.duration.slow} ${motion.easing.standard}`,
        },
        [`${header}[data-state="closing"] &`]: {
          animation: `${fold} ${motion.duration.base} ${motion.easing.standard} forwards`,
        },
      },
    },
    [still]: { animationDuration: '1ms !important' },
  },
});

// Nothing scrolls behind the open menu.
globalStyle(':root[data-menu-open]', {
  '@media': { [narrow]: { overflow: 'hidden' } },
});

export const headerInner = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  alignContent: 'flex-start',
  minHeight: bar,
  columnGap: space[6],
  '@media': { [media.lg]: { minHeight: '4.25rem' } },
});

export const headerBrand = style({
  marginInlineEnd: 'auto',
  paddingBlock: space[3],
  '@media': { [media.lg]: { paddingBlock: space[4] } },
});

/* Navigation and actions share one region: a full-screen menu below lg,
   inline from lg up, where all eight links fit on one line. DOM order
   matches visual order at every width. */
export const navRegion = style({
  display: 'none',
  flexBasis: '100%',
  flexDirection: 'column',
  gap: space[8],
  minHeight: `calc(100dvh - ${bar})`,
  paddingBlock: `${space[2]} max(${space[6]}, env(safe-area-inset-bottom))`,
  selectors: {
    [`${header}:is([data-state="open"], [data-state="closing"]) &`]: {
      display: 'flex',
    },
  },
  '@media': {
    [narrow]: {
      selectors: {
        [`${header}[data-state="closing"] &`]: {
          animation: `${fade} ${motion.duration.fast} ${motion.easing.out} forwards`,
        },
      },
    },
    [media.lg]: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      flexBasis: 'auto',
      gap: space[4],
      minHeight: 0,
      paddingBlock: 0,
    },
  },
});

export const nav = style({
  '@media': { [narrow]: { flex: 1 } },
});

export const navList = style({
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
  padding: 0,
  listStyle: 'none',
  '@media': { [media.lg]: { flexDirection: 'row', alignItems: 'center' } },
});

// Links arrive one after another as the band opens.
for (let n = 1; n <= 12; n++)
  globalStyle(`${header}[data-state="open"] ${navList} > li:nth-child(${n})`, {
    '@media': {
      [narrow]: {
        animation: `${rise} ${motion.duration.slow} ${motion.easing.out} ${
          60 + n * 25
        }ms both`,
      },
    },
  });

// Without motion, everything is simply there.
globalStyle(`${header} *`, {
  '@media': {
    [still]: {
      animationDuration: '1ms !important',
      animationDelay: '0ms !important',
    },
  },
});
