import { media, vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { color, font, space, radius, shadow } = vars;
const { md, lg } = media;

/* Section intros: an overline, a light title and a short lede. */
export const intro = style({
  display: 'grid',
  gap: space[3],
  maxWidth: '40rem',
  marginBlockEnd: space[12],
});

export const introCentered = style([
  intro,
  { marginInline: 'auto', textAlign: 'center' },
]);

export const overline = style({
  color: color.text.muted,
  fontSize: font.size['2xs'],
  fontWeight: font.weight.semibold,
  letterSpacing: font.tracking.caps,
  textTransform: 'uppercase',
});

export const title = style({
  fontSize: font.size['2xl'],
  fontWeight: font.weight.light,
  '@media': { [md]: { fontSize: font.size['3xl'] } },
});

export const lede = style({
  color: color.text.default,
  fontSize: font.size.md,
});

/* Hero media: the rendered page behind, top right, its name header in
   view; resume.json in front, bottom left, over the page's body text. Both
   share one grid cell, so the pair always fits inside the hero. Block
   margins in % follow the cell's width, so the overlap scales with it. */
export const demo = style({
  display: 'grid',
  isolation: 'isolate',
});

const layer = {
  gridArea: '1 / 1',
  borderRadius: radius.lg,
  boxShadow: shadow.lg,
};

export const demoPreview = style({
  ...layer,
  alignSelf: 'start',
  justifySelf: 'end',
  // A page, not a browser window: the screenshot's grey margins are cropped.
  width: '66%',
  height: 'auto',
  aspectRatio: '5 / 6',
  objectFit: 'cover',
  objectPosition: 'top',
  border: `1px solid ${color.border.subtle}`,
  backgroundColor: color.surface.page,
  '@media': { [md]: { width: '58%' } },
});

export const demoCode = style({
  ...layer,
  zIndex: 1,
  alignSelf: 'end',
  justifySelf: 'start',
  width: '94%',
  marginBlockStart: '30%',
  fontSize: font.size.xs,
  '@media': { [md]: { width: '84%', marginBlockStart: '24%' } },
});

/* Theme showcase */
export const center = style({
  display: 'flex',
  justifyContent: 'center',
  marginBlockStart: space[10],
});

/* For developers: copy beside a terminal. */
export const split = style({
  display: 'grid',
  gap: space[10],
  alignItems: 'center',
  '@media': { [lg]: { gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)' } },
});

export const checklist = style({
  display: 'grid',
  gap: space[3],
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const checkItem = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  gap: space[3],
  alignItems: 'baseline',
  '::before': {
    content: '""',
    width: space[2],
    height: space[2],
    borderRadius: radius.full,
    backgroundColor: color.action.primary,
    transform: 'translateY(-0.1em)',
  },
});

export const devActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[3],
  marginBlockStart: space[8],
});

/* Open source band */
export const band = style({
  display: 'grid',
  gap: space[6],
  justifyItems: 'center',
  textAlign: 'center',
});

export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: space[3],
});
