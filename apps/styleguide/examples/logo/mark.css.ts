import { style } from '@vanilla-extract/css';
import { vars } from '@jsonresume/ui/tokens';

// An app-icon tile: the mark in ink on brand yellow, in both themes.
export const tile = style({
  display: 'inline-grid',
  placeItems: 'center',
  width: '3.5rem',
  height: '3.5rem',
  borderRadius: vars.radius.lg,
  backgroundColor: vars.color.surface.brand,
  color: vars.color.text.onBrand,
  fontSize: vars.font.size['2xl'],
});

// Beside text: on one line, centred on it.
export const inline = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[2],
});
