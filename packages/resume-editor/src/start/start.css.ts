import { media, vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { color, font, space, radius } = vars;

export const page = style({
  display: 'grid',
  gap: space[8],
  paddingBlock: space[8],
});

export const ways = style({
  display: 'grid',
  gap: space[4],
  '@media': {
    [media.md]: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
  },
});

export const way = style({
  display: 'grid',
  alignContent: 'start',
  gap: space[3],
  padding: space[5],
  border: `1px solid ${color.border.subtle}`,
  borderRadius: radius.lg,
  backgroundColor: color.surface.raised,
});

export const paste = style({ minHeight: '8rem' });

export const fields = style({
  display: 'grid',
  gap: space[4],
  '@media': {
    [media.md]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  },
});

export const wide = style({
  '@media': { [media.md]: { gridColumn: '1 / -1' } },
});

export const entry = style({
  display: 'grid',
  gap: space[4],
  padding: space[4],
  border: `1px solid ${color.border.subtle}`,
  borderRadius: radius.md,
});

export const unsure = style({
  borderInlineStart: `3px solid ${color.status.warning}`,
  paddingInlineStart: space[3],
});

export const summary = style({
  margin: 0,
  color: color.text.muted,
  fontSize: font.size.sm,
});

export const previewLayout = style({
  display: 'grid',
  gap: space[6],
  '@media': {
    [media.lg]: { gridTemplateColumns: 'minmax(0, 1fr) 20rem' },
  },
});

export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[3],
  alignItems: 'center',
});

export const aside = style({
  display: 'grid',
  alignContent: 'start',
  gap: space[4],
});

export const intro = style({ display: 'grid', gap: space[2] });
