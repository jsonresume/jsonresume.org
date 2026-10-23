import { style } from '@vanilla-extract/css';

// Keep a trailing icon on the link's baseline and with its text.
export const iconLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3em',
});
