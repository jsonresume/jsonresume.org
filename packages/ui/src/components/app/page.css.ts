import { style } from '@vanilla-extract/css';
import { vars } from '../../tokens/contract.css';
import { media } from '../../tokens/theme';

const { color, font, space, radius, shadow } = vars;

/* AppPage */

export const page = style({
  display: 'grid',
  gap: space[6],
  maxWidth: '84rem',
  marginInline: 'auto',
});

export const header = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: space[4],
});

export const titles = style({ display: 'grid', gap: space[1], minWidth: 0 });

export const title = style({
  margin: 0,
  color: color.text.strong,
  fontSize: font.size['2xl'],
  fontWeight: font.weight.light,
  lineHeight: font.lineHeight.tight,
  '@media': { [media.md]: { fontSize: font.size['3xl'] } },
});

export const description = style({
  margin: 0,
  color: color.text.muted,
  fontSize: font.size.sm,
});

export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[2],
});

export const toolbar = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: space[3],
});

/* AuthCard */

export const authWrap = style({
  display: 'grid',
  placeItems: 'center',
  paddingBlock: space[12],
  paddingInline: space[4],
});

export const authCard = style({
  display: 'grid',
  gap: space[6],
  width: 'min(100%, 26rem)',
  padding: space[8],
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.lg,
  backgroundColor: color.surface.raised,
  boxShadow: shadow.sm,
});

export const authHead = style({
  display: 'grid',
  gap: space[2],
  textAlign: 'center',
});

export const authTitle = style({
  margin: 0,
  color: color.text.strong,
  fontSize: font.size['2xl'],
  fontWeight: font.weight.light,
  lineHeight: font.lineHeight.tight,
});

export const authFooter = style({
  margin: 0,
  color: color.text.muted,
  fontSize: font.size.sm,
  textAlign: 'center',
});

/* GithubIcon */

export const icon = style({
  display: 'inline-block',
  flexShrink: 0,
  width: '1em',
  height: '1em',
  verticalAlign: '-0.125em',
});
