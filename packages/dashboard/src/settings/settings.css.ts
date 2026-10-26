import { vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

const { color, font, space } = vars;

/** One OAuth app: its name, id and users, then its actions. */
export const app = style({
  display: 'grid',
  gap: space[3],
  paddingBlock: space[3],
  borderBlockStart: `1px solid ${color.border.subtle}`,
});

/** Client IDs are long and unbroken; let them wrap on narrow screens. */
export const clientId = style({
  fontFamily: font.family.mono,
  fontSize: font.size.sm,
  overflowWrap: 'anywhere',
});
