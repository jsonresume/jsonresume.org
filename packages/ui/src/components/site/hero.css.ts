import { style } from '@vanilla-extract/css';
import { onBrandVars } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';
import { media } from '../../tokens/theme';

const { font, color, space } = vars;

/* Hero: the yellow promo band from the jsonresume.org home page. */
export const hero = style({
  backgroundColor: color.surface.brand,
  color: color.text.onBrand,
  // Phones get half the height: the band shouldn't fill the first screen.
  paddingBlock: `${space[12]} ${space[16]}`,
  textAlign: 'center',
  '@media': { [media.md]: { paddingBlock: `${space[20]} ${space[30]}` } },
});

/* Ink-on-yellow text tokens. Centered, the whole band gets them; split, only
   the copy does, so media (a code block, a card) keeps the page theme. */
export const onBrand = style({ vars: onBrandVars });

/* With media: copy on the left, media on the right from lg up. */
export const split = style({
  paddingBlock: `${space[10]} ${space[12]}`,
  '@media': {
    [media.md]: { paddingBlock: `${space[16]} ${space[20]}` },
    [media.lg]: { textAlign: 'start' },
  },
});

/* Compact: inner pages. Less height and a smaller title, same band. */
export const compact = style({
  paddingBlock: `${space[8]} ${space[10]}`,
  '@media': { [media.md]: { paddingBlock: `${space[12]} ${space[16]}` } },
});

/* Start-aligned copy without media (inner pages). */
export const start = style({ textAlign: 'start' });

export const splitGrid = style({
  display: 'grid',
  gap: space[8],
  alignItems: 'center',
  '@media': {
    [media.lg]: {
      gap: space[12],
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
    },
  },
});

export const heroTitle = style({
  margin: 0,
  color: color.text.onBrand,
  fontSize: font.size['3xl'],
  fontWeight: font.weight.light,
  lineHeight: font.lineHeight.tight,
  textWrap: 'balance',
  selectors: { [`${compact} &`]: { fontSize: font.size['2xl'] } },
  '@media': {
    [media.md]: {
      fontSize: font.size['4xl'],
      selectors: { [`${compact} &`]: { fontSize: font.size['3xl'] } },
    },
  },
});

export const eyebrow = style({
  marginBlockEnd: space[4],
  fontSize: font.size['2xs'],
  fontWeight: font.weight.semibold,
  letterSpacing: font.tracking.caps,
  textTransform: 'uppercase',
});

export const heroLede = style({
  maxWidth: '520px',
  marginInline: 'auto',
  marginBlockStart: space[6],
  fontSize: font.size.md,
  lineHeight: font.lineHeight.normal,
  selectors: {
    [`${start} &`]: { marginInline: 0, maxWidth: '40rem' },
    [`${compact} &`]: { marginBlockStart: space[4] },
  },
  '@media': {
    [media.lg]: {
      selectors: {
        [`${split} &`]: { marginInline: 0, fontSize: font.size.lg },
      },
    },
  },
});

export const heroActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: space[3],
  marginBlockStart: space[6],
  selectors: {
    [`${start} &`]: { justifyContent: 'flex-start' },
    [`${compact} &`]: { marginBlockStart: space[5] },
  },
  '@media': {
    [media.lg]: {
      selectors: { [`${split} &`]: { justifyContent: 'flex-start' } },
    },
  },
});

export const heroMedia = style({
  minWidth: 0,
  textAlign: 'start',
});
