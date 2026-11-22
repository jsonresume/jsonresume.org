import { media, vars } from '@jsonresume/ui/tokens';
import { style } from '@vanilla-extract/css';

/* What they want: the band, the editor's sections, the pass menu. */

export const reasonsMenu = style({
  display: 'grid',
  gap: vars.space[2],
  maxWidth: '16rem',
});

export const reasonChips = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[1],
});

/** "What you want", summed up in one band. */
export const wants = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space[2],
  padding: vars.space[3],
  borderRadius: vars.radius.md,
  background: vars.color.surface.subtle,
  border: `1px solid ${vars.color.border.subtle}`,
});

export const wantsLabel = style({
  fontSize: vars.font.size['2xs'],
  letterSpacing: vars.font.tracking.caps,
  textTransform: 'uppercase',
  color: vars.color.text.muted,
  fontWeight: vars.font.weight.semibold,
});

export const grow = style({ flex: 1 });

export const section = style({ display: 'grid', gap: vars.space[2] });

export const sectionTitle = style({
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold,
  margin: 0,
});

export const sectionHint = style({
  fontSize: vars.font.size.xs,
  color: vars.color.text.muted,
  margin: 0,
});

export const choices = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[1],
});

export const pair = style({
  display: 'grid',
  gap: vars.space[3],
  '@media': { [media.sm]: { gridTemplateColumns: '1fr 1fr' } },
});

/** A long phrase wraps rather than running off a phone. */
export const wantBadge = style({
  whiteSpace: 'normal',
  maxWidth: '100%',
  overflowWrap: 'anywhere',
  textAlign: 'left',
});
