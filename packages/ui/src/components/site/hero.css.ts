import { style } from '@vanilla-extract/css';
import { onBrandVars } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';
import { media } from '../../tokens/theme';

const { font, color, space } = vars;

/* Hero: the yellow promo band from the jsonresume.org home page. */
export const hero = style({
  backgroundColor: color.surface.brand,
  color: color.text.onBrand,
  paddingBlock: `${space[20]} ${space[30]}`,
  textAlign: 'center',
});

/* Ink-on-yellow text tokens. Centered, the whole band gets them; split, only
   the copy does, so media (a code block, a card) keeps the page theme. */
export const onBrand = style({ vars: onBrandVars });

/* With media: copy on the left, media on the right from lg up. */
export const split = style({
  paddingBlock: `${space[16]} ${space[20]}`,
  '@media': { [media.lg]: { textAlign: 'start' } },
});

export const splitGrid = style({
  display: 'grid',
  gap: space[12],
  alignItems: 'center',
  '@media': {
    [media.lg]: { gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)' },
  },
});

export const heroTitle = style({
  margin: 0,
  color: color.text.onBrand,
  fontSize: font.size['3xl'],
  fontWeight: font.weight.light,
  lineHeight: font.lineHeight.tight,
  textWrap: 'balance',
  '@media': { [media.md]: { fontSize: font.size['4xl'] } },
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
  marginBlockStart: space[8],
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
