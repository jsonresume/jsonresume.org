import { style } from '@vanilla-extract/css';

/* At least a screen tall, so the footer sits at the bottom of short pages. */
export const page = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100dvh',
});

export const main = style({ flex: 1 });
