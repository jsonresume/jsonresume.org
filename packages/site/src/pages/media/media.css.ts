import { vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { color, font, space, radius } = vars;

export const shot = style({
  width: '100%',
  height: 'auto',
  borderRadius: radius.md,
  boxShadow: vars.shadow.lg,
  backgroundColor: color.surface.raised,
});

export const quote = style({
  margin: 0,
  color: color.text.strong,
  fontSize: font.size.md,
  lineHeight: font.lineHeight.normal,
});

export const asset = style({
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
  overflow: 'hidden',
  border: `1px solid ${color.border.default}`,
  borderRadius: radius.md,
  backgroundColor: color.surface.raised,
});

export const assetShot = style({
  width: '100%',
  height: 'auto',
  aspectRatio: '4 / 3',
  objectFit: 'cover',
  objectPosition: 'top',
  borderBlockEnd: `1px solid ${color.border.subtle}`,
});

export const assetBody = style({
  display: 'grid',
  gap: space[2],
  alignContent: 'start',
  padding: space[4],
});

export const assetFormat = style({
  color: color.text.muted,
  fontSize: font.size['2xs'],
  letterSpacing: font.tracking.caps,
  textTransform: 'uppercase',
});

export const contact = style({ display: 'grid', gap: space[3] });

export const name = style({
  margin: 0,
  fontSize: font.size.xl,
  fontWeight: font.weight.semibold,
  color: color.text.strong,
});
