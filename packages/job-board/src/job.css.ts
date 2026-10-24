import { media, vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { color, font, space } = vars;

export const layout = style({
  display: 'grid',
  gap: space[8],
  '@media': {
    [media.lg]: {
      gridTemplateColumns: 'minmax(0, 1fr) 18rem',
      alignItems: 'start',
    },
  },
});

export const crumbs = style({ marginBlockEnd: space[4] });

export const article = style({ display: 'grid', gap: space[8], minWidth: 0 });

export const header = style({ display: 'grid', gap: space[3] });

export const company = style({
  margin: 0,
  color: color.text.muted,
  fontSize: font.size.md,
});

export const badges = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[2],
});

export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space[2],
});

export const block = style({ display: 'grid', gap: space[3] });

export const bullets = style({
  margin: 0,
  paddingInlineStart: space[5],
  display: 'grid',
  gap: space[1],
});

export const skillName = style({ fontWeight: font.weight.semibold });

export const post = style({
  display: 'grid',
  gap: space[3],
  padding: space[5],
  borderInlineStart: `3px solid ${color.border.strong}`,
  background: color.surface.subtle,
  overflowWrap: 'anywhere',
  whiteSpace: 'pre-line',
});

export const facts = style({
  display: 'grid',
  gap: space[3],
  margin: 0,
  padding: space[5],
  '@media': { [media.lg]: { position: 'sticky', top: space[6] } },
});

export const factLabel = style({
  color: color.text.muted,
  fontSize: font.size.xs,
  textTransform: 'uppercase',
  letterSpacing: font.tracking.caps,
});

export const factValue = style({ margin: 0, color: color.text.strong });
