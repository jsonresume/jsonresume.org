import { style } from '@vanilla-extract/css';
import { focusRing, transition } from '../../styles/shared.css';
import { vars } from '../../tokens/contract.css';
import { media } from '../../tokens/theme';
import { header } from './site-header.css';

const { space } = vars;
const still = '(prefers-reduced-motion: reduce)';

/* The menu button: three lines that turn into a cross. */
export const navToggle = style([
  focusRing,
  {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.75rem',
    height: '2.75rem',
    marginInlineEnd: `calc(${space[2]} * -1)`,
    border: 0,
    borderRadius: vars.radius.full,
    background: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
    transition: `background-color ${transition}`,
    '@media': {
      [media.lg]: { display: 'none' },
      // A finger leaves :hover behind after a tap: only a mouse gets it.
      '(hover: hover)': {
        selectors: { '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.06)' } },
      },
    },
    selectors: { '&:active': { backgroundColor: 'rgba(0, 0, 0, 0.1)' } },
  },
]);

/** Three lines that turn into a cross. */
export const toggleLines = style({
  position: 'relative',
  width: '1.25rem',
  height: '0.875rem',
});

export const toggleLine = style({
  position: 'absolute',
  insetInline: 0,
  height: '2px',
  borderRadius: '1px',
  backgroundColor: 'currentColor',
  transition: `transform ${transition}, opacity ${transition}, top ${transition}`,
  selectors: {
    '&:nth-child(1)': { top: 0 },
    '&:nth-child(2)': { top: 'calc(50% - 1px)' },
    '&:nth-child(3)': { top: 'calc(100% - 2px)' },
    [`${header}[data-state="open"] &:nth-child(1)`]: {
      top: 'calc(50% - 1px)',
      transform: 'rotate(45deg)',
    },
    [`${header}[data-state="open"] &:nth-child(2)`]: {
      opacity: 0,
      transform: 'scaleX(0.2)',
    },
    [`${header}[data-state="open"] &:nth-child(3)`]: {
      top: 'calc(50% - 1px)',
      transform: 'rotate(-45deg)',
    },
  },
  '@media': { [still]: { transition: 'none' } },
});
