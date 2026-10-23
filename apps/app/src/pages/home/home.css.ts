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

/* Hero media: resume.json in front, the rendered resume behind it. Both
   share one grid cell, so the pair always fits inside the hero. */
export const demo = style({
  display: 'grid',
  isolation: 'isolate',
});

const layer = {
  gridArea: '1 / 1',
  borderRadius: radius.lg,
  boxShadow: shadow.lg,
};

export const demoCode = style({
  ...layer,
  zIndex: 1,
  alignSelf: 'start',
  justifySelf: 'start',
  width: '100%',
  marginBlockEnd: '58%',
  fontSize: font.size.xs,
  '@media': { [md]: { width: '78%', marginBlockEnd: '34%' } },
});

export const demoPreview = style({
  ...layer,
  alignSelf: 'end',
  justifySelf: 'end',
  width: '72%',
  height: 'auto',
  marginBlockStart: '22%',
  border: `1px solid ${color.border.subtle}`,
  backgroundColor: color.surface.page,
});

/* Theme showcase */
export const themeGrid = style({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  display: 'grid',
  gap: space[6],
  gridTemplateColumns: 'repeat(auto-fill, minmax(14rem, 1fr))',
});

export const themeLink = style({
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
  alignContent: 'start',
  height: '100%',
  color: 'inherit',
  textDecoration: 'none',
});

export const themeShot = style({
  width: '100%',
  height: 'auto',
  aspectRatio: '5 / 4',
  objectFit: 'cover',
  objectPosition: 'top',
  borderBlockEnd: `1px solid ${color.border.subtle}`,
});

export const themeBody = style({
  display: 'grid',
  gap: space[1],
  padding: space[4],
});

export const themeName = style({
  color: color.text.strong,
  fontSize: font.size.md,
  fontWeight: font.weight.semibold,
});

export const themeDescription = style({
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  color: color.text.muted,
  fontSize: font.size.xs,
  lineHeight: font.lineHeight.snug,
});

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
