import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { onBrandVars } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';

const { color, font, space } = vars;

export const banner = recipe({
  base: {
    borderBlockEnd: `1px solid ${color.border.subtle}`,
    fontSize: font.size.sm,
    lineHeight: font.lineHeight.snug,
  },
  variants: {
    tone: {
      brand: {
        backgroundColor: color.surface.brand,
        color: color.text.onBrand,
        vars: onBrandVars,
      },
      info: {
        backgroundColor: color.status.infoSurface,
        color: color.text.default,
      },
      warning: {
        backgroundColor: color.status.warningSurface,
        color: color.text.default,
      },
      neutral: {
        backgroundColor: color.surface.muted,
        color: color.text.default,
      },
    },
  },
  defaultVariants: { tone: 'brand' },
});

export const inner = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: `${space[2]} ${space[4]}`,
  paddingBlock: space[3],
});

export const content = style({ flex: '1 1 20rem', minWidth: 0 });

export const actions = style({
  display: 'flex',
  alignItems: 'center',
  gap: space[2],
});
