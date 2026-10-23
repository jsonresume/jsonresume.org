import { style } from '@vanilla-extract/css';
import { vars } from '../tokens/contract.css';
import { palette } from '../tokens/palette';

/** Shared focus ring for interactive elements that are not inside `base`. */
export const focusRing = style({
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${vars.color.focus}`,
      outlineOffset: '2px',
    },
  },
});

export const visuallyHidden = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  padding: 0,
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  border: 0,
});

export const transition = `${vars.motion.duration.base} ${vars.motion.easing.standard}`;

/**
 * Brand yellow is the same in light and dark themes, so anything placed on
 * it must use ink-on-yellow colors in both. Surfaces that render yellow
 * reassign the text, link and focus tokens for their descendants.
 */
export const onBrandVars = {
  [vars.color.text.default]: palette.gray[900],
  [vars.color.text.strong]: palette.gray[900],
  [vars.color.text.muted]: '#5c5c5c',
  [vars.color.text.link]: palette.red[700],
  [vars.color.text.linkHover]: palette.red[800],
  [vars.color.focus]: palette.gray[900],
};
