import { vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { color, font, space } = vars;

export const rules = style({
  display: 'grid',
  gap: space[6],
  margin: 0,
  padding: 0,
  listStyle: 'none',
  gridTemplateColumns: 'repeat(auto-fill, minmax(15rem, 1fr))',
});

export const rule = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  columnGap: space[3],
  rowGap: space[1],
  alignItems: 'baseline',
  '::before': {
    content: '"✓"',
    gridRow: '1 / span 2',
    color: color.status.success,
    fontWeight: font.weight.bold,
  },
});

export const ruleLabel = style({
  color: color.text.strong,
  fontSize: font.size.md,
});
