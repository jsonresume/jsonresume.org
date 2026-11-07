import { keyframes, style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../../tokens/contract.css';

const { color, font, space, radius } = vars;

export const list = style({
  display: 'grid',
  gap: space[2],
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const step = style({
  display: 'grid',
  gridTemplateColumns: '1.25rem 1fr',
  columnGap: space[2],
  alignItems: 'start',
  fontSize: font.size.sm,
});

const spin = keyframes({ to: { transform: 'rotate(360deg)' } });

const mark = style({
  boxSizing: 'border-box',
  width: '1rem',
  height: '1rem',
  marginBlockStart: '0.125rem',
  borderRadius: radius.full,
  display: 'grid',
  placeItems: 'center',
});

export const marks = styleVariants({
  done: [
    mark,
    { backgroundColor: color.status.success, color: color.surface.page },
  ],
  active: [
    mark,
    {
      border: `2px solid ${color.border.default}`,
      borderTopColor: color.status.info,
      animation: `${spin} 0.9s linear infinite`,
      '@media': {
        '(prefers-reduced-motion: reduce)': {
          animation: 'none',
          borderColor: color.status.info,
        },
      },
    },
  ],
  waiting: [mark, { border: `2px solid ${color.border.default}` }],
});

export const titles = styleVariants({
  done: { color: color.text.muted },
  active: { color: color.text.strong, fontWeight: font.weight.semibold },
  waiting: { color: color.text.muted },
});

export const detail = style({
  gridColumn: 2,
  margin: 0,
  color: color.text.muted,
});
