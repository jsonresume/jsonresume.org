import { media, vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { color, font, space } = vars;

export const loading = style({
  display: 'grid',
  gap: space[6],
  padding: space[8],
});
export const footerLink = style({
  color: color.text.muted,
  fontSize: font.size.xs,
});
export const stack = style({ display: 'grid', gap: space[6] });

export const kpis = style({
  display: 'grid',
  gap: space[4],
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 9.5rem), 1fr))',
});

export const breakdowns = style({
  display: 'grid',
  gap: space[6],
  gridTemplateColumns: 'minmax(0, 1fr)',
  '@media': {
    [media.md]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
    [media.xl]: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
  },
});

export const panel = style({
  minWidth: 0,
  padding: space[5],
  border: `1px solid ${color.border.default}`,
  borderRadius: vars.radius.md,
  backgroundColor: color.surface.raised,
});

export const panelTitle = style({
  margin: 0,
  marginBlockEnd: space[4],
  color: color.text.strong,
  fontSize: font.size.sm,
  fontWeight: font.weight.semibold,
});

export const muted = style({ color: color.text.muted, fontSize: font.size.sm });
export const row = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: space[3],
});
export const tableWrap = style({ overflowX: 'auto' });
export const nowrap = style({ whiteSpace: 'nowrap' });
