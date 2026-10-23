import { createVar, globalStyle, style } from '@vanilla-extract/css';
import { media, vars } from '@jsonresume/ui/tokens';

const { color, font, space, radius } = vars;

const focusOutline = {
  outline: `2px solid ${color.focus}`,
  outlineOffset: '2px',
};

/* Values pages set per element with assignInlineVars. */
export const fill = createVar();
export const barWidth = createVar();
export const demoRadius = createVar();
export const demoShadow = createVar();
export const specimenSize = createVar();
export const specimenWeight = createVar();
export const specimenFamily = createVar();

/* Page shell */

export const layout = style({
  display: 'grid',
  gap: space[8],
  paddingBlock: `${space[10]} ${space[16]}`,
  '@media': {
    [media.lg]: {
      gridTemplateColumns: '14rem minmax(0, 1fr)',
      alignItems: 'start',
    },
  },
});

export const sidebar = style({
  '@media': {
    [media.lg]: {
      position: 'sticky',
      top: space[6],
      maxHeight: 'calc(100vh - 3rem)',
      overflowY: 'auto',
    },
  },
});

export const main = style({ minWidth: 0 });

export const article = style({ display: 'grid', gap: space[12], minWidth: 0 });

export const section = style({
  display: 'grid',
  gap: space[4],
  scrollMarginTop: space[6],
});

export const sectionHeader = style({ display: 'grid', gap: space[2] });

export const lede = style({
  maxWidth: '64ch',
  color: color.text.muted,
  fontSize: font.size.md,
});

/* Sidebar: a disclosure on small screens, a sticky list on wide ones. */

export const desktopNav = style({
  display: 'none',
  '@media': { [media.lg]: { display: 'block' } },
});

export const mobileNav = style({
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.sm,
  '@media': { [media.lg]: { display: 'none' } },
});

const capsLabel = {
  color: color.text.muted,
  fontSize: font.size['2xs'],
  fontWeight: font.weight.semibold,
  letterSpacing: font.tracking.caps,
  textTransform: 'uppercase',
  cursor: 'pointer',
} as const;

export const mobileNavSummary = style({
  ...capsLabel,
  padding: `${space[3]} ${space[4]}`,
  color: color.text.strong,
  selectors: { '&:focus-visible': focusOutline },
});

/* Live example: a preview canvas over its source. */

export const example = style({
  margin: 0,
  overflow: 'hidden',
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.sm,
});

export const exampleHead = style({
  display: 'grid',
  gap: space[1],
  padding: `${space[4]} ${space[5]}`,
  borderBottom: `1px solid ${color.border.subtle}`,
});

export const exampleTitle = style({
  margin: 0,
  color: color.text.strong,
  fontSize: font.size.md,
  fontWeight: font.weight.semibold,
});

export const exampleDescription = style({
  margin: 0,
  color: color.text.muted,
  fontSize: font.size.sm,
});

const grid = (line: string) =>
  `linear-gradient(90deg, ${line} 1px, transparent 1px) 0 0 / 16px 16px, linear-gradient(${line} 1px, transparent 1px) 0 0 / 16px 16px`;

export const preview = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: space[3],
  padding: `${space[8]} ${space[6]}`,
  background: `${grid(color.border.subtle)}, ${color.surface.page}`,
});

export const previewBleed = style({ display: 'block', padding: 0 });

export const previewBlock = style({ display: 'block' });

export const source = style({ borderTop: `1px solid ${color.border.default}` });

// The CodeBlock inside drops its own frame; the example already has one.
globalStyle(`${source} > div`, { border: 0, borderRadius: 0 });

export const sourceSummary = style({
  ...capsLabel,
  padding: `${space[3]} ${space[5]}`,
  background: color.surface.subtle,
  selectors: {
    '&:hover': { color: color.text.strong },
    '&:focus-visible': { ...focusOutline, outlineOffset: '-2px' },
    'details[open] > &': { borderBottom: `1px solid ${color.border.default}` },
  },
});

/* Playground: preview beside controls, code underneath. */

export const playground = style({
  display: 'grid',
  '@media': { [media.md]: { gridTemplateColumns: 'minmax(0, 1fr) 15rem' } },
});

export const playgroundPreview = style({
  minHeight: '12rem',
  justifyContent: 'center',
});

export const playgroundControls = style({
  padding: space[5],
  borderLeft: `1px solid ${color.border.subtle}`,
  background: color.surface.subtle,
});

/* Guidelines */

export const guidelines = style({
  display: 'grid',
  gap: space[4],
  '@media': { [media.md]: { gridTemplateColumns: '1fr 1fr' } },
});

export const guide = style({
  padding: space[5],
  borderTop: '3px solid',
  background: color.surface.subtle,
});

export const guideDo = style({ borderTopColor: color.status.success });
export const guideDont = style({ borderTopColor: color.status.danger });

globalStyle(`${guide} h3`, {
  margin: `0 0 ${space[3]}`,
  ...capsLabel,
  color: color.text.strong,
  cursor: 'auto',
});
globalStyle(`${guide} ul`, {
  display: 'grid',
  gap: space[2],
  margin: 0,
  paddingLeft: '1.2em',
});

/* Props tables and token text */

const monoXs = {
  fontFamily: font.family.mono,
  fontSize: font.size.xs,
} as const;

export const propName = style({
  ...monoXs,
  color: color.text.strong,
  whiteSpace: 'nowrap',
});
export const propType = style({ ...monoXs, color: color.text.muted });
export const mono = style({
  ...monoXs,
  color: color.text.muted,
  overflowWrap: 'anywhere',
});
export const values = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[1],
});
export const componentLabel = style({
  fontFamily: font.family.mono,
  fontSize: font.size.sm,
  color: color.text.strong,
});

/* Swatches */

export const swatchGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(11rem, 100%), 1fr))',
  gap: space[4],
});

export const swatch = style({
  overflow: 'hidden',
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.sm,
  background: color.surface.raised,
});

export const swatchColor = style({
  height: '4.5rem',
  borderBottom: `1px solid ${color.border.subtle}`,
  background: fill,
});

export const swatchMeta = style({
  display: 'grid',
  gap: '2px',
  padding: space[3],
  fontSize: font.size.xs,
});
export const swatchName = style({
  color: color.text.strong,
  fontWeight: font.weight.semibold,
});

export const chip = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: space[2],
});

export const chipColor = style({
  flexShrink: 0,
  width: '1.25rem',
  height: '1.25rem',
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.sm,
  background: fill,
});

/* Foundation specimens */

export const specimen = style({
  display: 'grid',
  gap: space[1],
  paddingBlock: space[4],
  borderBottom: `1px solid ${color.border.subtle}`,
});

export const specimenText = style({
  fontFamily: specimenFamily,
  fontSize: specimenSize,
  fontWeight: specimenWeight,
  lineHeight: 1.3,
  vars: {
    [specimenFamily]: font.family.sans,
    [specimenSize]: font.size.md,
    [specimenWeight]: font.weight.regular,
  },
});

export const scaleBar = style({
  width: barWidth,
  height: '0.75rem',
  borderRadius: '1px',
  background: color.action.primary,
});

export const demoBox = style({
  display: 'grid',
  placeItems: 'center',
  width: '6rem',
  height: '6rem',
  border: `1px solid ${color.border.subtle}`,
  borderRadius: demoRadius,
  boxShadow: demoShadow,
  background: color.surface.raised,
  color: color.text.muted,
  fontSize: font.size.xs,
  vars: { [demoRadius]: '0', [demoShadow]: 'none' },
});

export const demoBorder = style({ border: `2px solid ${color.border.strong}` });

export const stackTight = style({ marginTop: space[3] });

/* Overview cards */

export const cardLink = style({
  display: 'block',
  height: '100%',
  color: 'inherit',
  textDecoration: 'none',
  selectors: { '&:focus-visible': focusOutline },
});

/* Brand lockups */

export const lockup = style({
  display: 'grid',
  placeItems: 'center',
  minHeight: '9rem',
  borderRadius: radius.sm,
});

export const lockupBrand = style({
  background: color.surface.brand,
  color: color.text.onBrand,
});

export const lockupPage = style({
  background: color.surface.page,
  border: `1px solid ${color.border.default}`,
});

// The wordmark inherits its color, so it reads white on ink.
export const lockupInverse = style({
  background: color.surface.inverse,
  color: color.text.inverse,
});

// Several files under one example (component, then its styles).
globalStyle(`${source} > div + div`, {
  borderTop: `1px solid ${color.border.default}`,
});
