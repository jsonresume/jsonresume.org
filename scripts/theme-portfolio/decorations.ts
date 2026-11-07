import type { Recipe } from './recipes.ts';
import type { CSS } from './composition.ts';

export function decorate(
  kind: NonNullable<Recipe['decoration']>,
  accent: string,
  add: (part: string, css: CSS) => void
) {
  if (kind === 'margin')
    add('masthead', {
      borderInlineStart: `4px solid ${accent}`,
      paddingInlineStart: '22px',
    });
  if (kind === 'curve')
    add('masthead', {
      borderBottom: `2px solid ${accent}`,
      borderEndEndRadius: '38px',
    });
  if (kind === 'diagonal')
    add('masthead', {
      borderInlineEnd: `12px solid ${accent}`,
      borderStartEndRadius: '48px',
    });
  if (kind === 'dots' || kind === 'squares')
    add('masthead::before', {
      content: '""',
      display: 'block',
      width: '9px',
      height: '9px',
      background: accent,
      borderRadius: kind === 'dots' ? '50%' : 0,
      boxShadow: '17px 0 #a92335, 34px 0 #bc8a29',
      marginBottom: '22px',
    });
}
