import { decorate } from './decorations.ts';
import type { Recipe } from './recipes.ts';
import type { PortfolioIdea } from './ideas.ts';
export type CSS = Record<string, unknown>;
export type Rule = [string, CSS];

/** Build-time recipe expansion; themes publish ordinary, self-contained CSS. */
export function composition(idea: PortfolioIdea, r: Recipe): Rule[] {
  const { palette: p } = idea;
  const rules: Rule[] = [];
  const add = (part: string, css: CSS) => rules.push([part, css]);
  add('name', {
    fontSize: `clamp(30px, 5vw, ${r.size}px)`,
    fontWeight:
      /DM Serif Display|Libre Caslon Display|Archivo Black|Anton/.test(
        idea.fonts.display
      )
        ? 400
        : 700,
  });
  add('masthead', { paddingBottom: '24px' });
  add('body', { gap: `${28 + (idea.index % 5) * 3}px` });
  add('sectionTitle', { border: 0, padding: 0, marginBottom: '14px' });
  if (r.header === 'rule' || r.header === 'double')
    add('masthead', {
      borderBottom: `${r.header === 'double' ? 4 : 1}px ${
        r.header === 'double' ? 'double' : 'solid'
      } ${p.accent}`,
    });
  if (r.header === 'top')
    add('masthead', { borderTop: `5px solid ${p.accent}`, paddingTop: '24px' });
  if (r.header === 'frame' || r.header === 'stamp')
    add(r.header === 'frame' ? 'masthead' : 'identity', {
      border: `1px solid ${p.accent}`,
      padding: r.header === 'frame' ? '26px' : '18px',
      maxWidth: '100%',
    });
  if (r.header === 'band') {
    const dark = [
      'cobalt',
      'contrast-banner',
      'counsel',
      'colour-block',
    ].includes(idea.key);
    add('masthead', {
      background: dark
        ? idea.key === 'colour-block'
          ? p.accent
          : p.sidebar
        : p.soft,
      color: dark ? '#fff' : p.ink,
      padding: '28px',
    });
    if (dark)
      for (const part of ['label', 'contact']) add(part, { color: 'inherit' });
  }
  if (r.header === 'split') {
    add('masthead', {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) minmax(180px, .55fr)',
      gap: '18px 28px',
      borderBottom: `1px solid ${p.rule}`,
      '@media': { 'screen and (max-width: 640px)': { display: 'block' } },
    });
    add('contact', {
      marginTop: 0,
      display: 'grid',
      alignContent: 'start',
      '@media': { 'screen and (max-width: 640px)': { marginTop: '18px' } },
    });
    add('summary', {
      gridColumn: '1 / -1',
      marginTop: 0,
      '@media': { 'screen and (max-width: 640px)': { marginTop: '22px' } },
    });
  }
  if (r.header === 'byline') {
    add('identity', { display: 'flex', flexDirection: 'column' });
    add('label', {
      order: -1,
      margin: '0 0 12px',
      fontSize: '15px',
      letterSpacing: '.07em',
    });
  }
  if (r.header === 'offset')
    add('identity', {
      marginInlineStart: '12%',
      paddingInlineStart: '22px',
      borderInlineStart: `7px solid ${p.accent}`,
      '@media': { 'screen and (max-width: 640px)': { marginInlineStart: 0 } },
    });
  const line = `1px solid ${p.accent}`;
  if (r.heading === 'rule' || r.heading === 'double' || r.heading === 'dotted')
    add('sectionTitle', {
      paddingBottom: '7px',
      borderBottom:
        r.heading === 'double'
          ? `3px double ${p.accent}`
          : r.heading === 'dotted'
          ? `1px dotted ${p.accent}`
          : line,
    });
  if (r.heading === 'short')
    add('sectionTitle', {
      paddingTop: '10px',
      backgroundImage: `linear-gradient(${p.accent},${p.accent})`,
      backgroundSize: '38px 2px',
      backgroundPosition: 'left top',
      backgroundRepeat: 'no-repeat',
    });
  if (r.heading === 'bar' || r.heading === 'tab')
    add('sectionTitle', {
      background: idea.key === 'redaction' ? '#20262e' : p.soft,
      color: idea.key === 'redaction' ? '#fff' : p.accent,
      padding: '8px 11px',
      borderRadius: r.heading === 'tab' ? '0 12px 12px 0' : 0,
    });
  if (r.heading === 'edge')
    add('sectionTitle', {
      borderInlineStart: `3px solid ${p.accent}`,
      paddingInlineStart: '11px',
    });
  if (r.heading === 'bracket')
    add('sectionTitle', {
      borderInlineStart: line,
      borderInlineEnd: line,
      padding: '2px 10px',
    });
  if (r.heading === 'number') {
    add('page', { counterReset: 'portfolio-section' });
    add('section', { counterIncrement: 'portfolio-section' });
    add('sectionTitle::before', {
      content: 'counter(portfolio-section, decimal-leading-zero) " / "',
      fontFamily: 'ui-monospace, monospace',
      fontSize: '.72em',
    });
  }
  if (r.heading === 'dot')
    add('sectionTitle::before', {
      content: '""',
      display: 'inline-block',
      width: '7px',
      height: '7px',
      marginInlineEnd: '11px',
      background: p.accent,
    });
  if (r.detail === 'italic') add('context', { fontStyle: 'italic' });
  if (r.detail === 'mono')
    for (const part of ['date', 'contact', 'details'])
      add(part, {
        fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
      });
  if (r.detail === 'uppercase')
    add('sectionTitle', {
      textTransform: 'uppercase',
      letterSpacing: '.09em',
      fontSize: '15px',
    });
  if (r.rail === 'line')
    add('secondary', {
      paddingInlineStart: '20px',
      borderInlineStart: `1px solid ${p.rule}`,
      '@media': {
        'screen and (max-width: 640px)': { paddingInlineStart: 0, border: 0 },
      },
    });
  if (r.rail === 'light' && idea.layout !== 'left')
    add('secondary', {
      background: p.soft,
      padding: '20px',
      '@media': { 'screen and (max-width: 640px)': { padding: '20px' } },
    });
  if (r.decoration) decorate(r.decoration, p.accent, add);
  return rules;
}
