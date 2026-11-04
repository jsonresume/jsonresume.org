import { globalStyle, keyframes, style } from '@vanilla-extract/css';
import { vars } from '../tokens/contract.css';

/**
 * Opt-in document base. Apply to <body> (or any root) to get the brand's
 * type, color and element defaults. Scoped so it never leaks into apps that
 * keep their own base styles.
 */
export const base = style({
  margin: 0,
  backgroundColor: vars.color.surface.page,
  color: vars.color.text.default,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.sm,
  lineHeight: vars.font.lineHeight.normal,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  textRendering: 'optimizeLegibility',
});

const scope = (selector: string) => `${base} ${selector}`;

globalStyle(scope('*, *::before, *::after'), { boxSizing: 'border-box' });

globalStyle(scope(':where(h1, h2, h3, h4, h5, h6)'), {
  margin: 0,
  color: vars.color.text.strong,
  lineHeight: vars.font.lineHeight.tight,
});

globalStyle(scope(':where(p, ul, ol, dl, blockquote, figure, pre)'), {
  margin: 0,
});

globalStyle(scope(':where(img, svg, video)'), {
  display: 'block',
  maxWidth: '100%',
});

globalStyle(scope(':where(button, input, select, textarea)'), {
  font: 'inherit',
  color: 'inherit',
});

// Plain links (no class) get the brand link colour. A link with a class,
// such as a button or a card, styles itself: the base scope class would
// otherwise tie with it, and win on hover by coming later.
globalStyle(scope(':where(a:not([class]))'), {
  color: vars.color.text.link,
  textUnderlineOffset: '0.15em',
});

globalStyle(scope(':where(a:not([class])):hover'), {
  color: vars.color.text.linkHover,
});

globalStyle(scope(':focus-visible'), {
  outline: `2px solid ${vars.color.focus}`,
  outlineOffset: '2px',
});

globalStyle(scope('::selection'), {
  backgroundColor: vars.color.surface.brand,
  color: vars.color.text.onBrand,
});

/* Page transitions, for apps that turn on view transitions: the old page
   fades quickly and the new one rises into place. Chrome named with
   viewTransitionName (the site header, the app's sidebar) stays put. */
const leave = keyframes({ to: { opacity: 0 } });
const arrive = keyframes({
  from: { opacity: 0, transform: 'translateY(6px)' },
});
globalStyle('::view-transition-old(root)', {
  animation: `${leave} 120ms ${vars.motion.easing.standard} both`,
});
globalStyle('::view-transition-new(root)', {
  animation: `${arrive} 220ms ${vars.motion.easing.out} 60ms both`,
});
globalStyle(
  '::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*)',
  { '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } } }
);
