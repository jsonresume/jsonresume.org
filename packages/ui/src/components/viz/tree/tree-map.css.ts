import { style } from '@vanilla-extract/css';
import { vars } from '../../../tokens/contract.css';

const { color, font } = vars;

/** Fills its parent: give the parent a height. */
export const root = style({
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  touchAction: 'none',
  userSelect: 'none',
  outline: 'none',
  // The squares' fill is the page colour, so the map sits on it.
  background: color.surface.page,
  fontFamily: font.family.sans,
  selectors: {
    '&[data-pointing]': { cursor: 'pointer' },
    '&:focus-visible': {
      boxShadow: `inset 0 0 0 2px ${color.focus}`,
    },
  },
});

export const layer = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
});

/** Read for the mono font's family; never shown. */
export const mono = style({
  position: 'absolute',
  visibility: 'hidden',
  fontFamily: font.family.mono,
});
