import { composition } from './composition.ts';
import type { PortfolioIdea } from './ideas.ts';
import type { Recipe } from './recipes.ts';

export function designSource(idea: PortfolioIdea, r: Recipe): string {
  const colors = { ...idea.palette };
  if (idea.layout === 'left' && r.rail === 'light') {
    colors.sidebar = colors.soft;
    colors.sidebarInk = colors.ink;
  }
  const compact = [
    'essential',
    'short-form',
    'compact-developer',
    'space-saver',
  ].includes(idea.key);
  const large = idea.key === 'large-type';
  const body =
    idea.key === 'easy-print'
      ? 'Arial, sans-serif'
      : `${idea.fonts.body}, Arial, sans-serif`;
  const display =
    idea.key === 'easy-print'
      ? 'Georgia, serif'
      : `${idea.fonts.display}, Georgia, serif`;
  const design = {
    color: colors,
    font: { body, display },
    type: {
      size: large ? '20px' : compact ? '15px' : '16px',
      leading: large ? '1.7' : compact ? '1.5' : '1.65',
      name: `${r.size}px`,
      heading: large ? '23px' : '19px',
    },
    space: {
      section: `${r.space}px`,
      entry: `${compact ? 16 : 23 + (idea.index % 3)}px`,
      gutter: `${40 + (idea.index % 4) * 4}px`,
    },
    width: `${r.width}px`,
  };
  const rules = composition(idea, r);
  if (r.size >= 70)
    rules.push(['name', { '@media': { print: { fontSize: '40pt' } } }]);
  if (idea.layout === 'left') {
    rules.push([
      'secondary sectionTitle',
      {
        background: 'transparent',
        borderColor: 'currentColor',
        color: 'inherit',
        paddingInlineStart: 0,
      },
    ]);
  }
  if (large)
    rules.push([
      'page',
      { '@media': { print: { fontSize: '12pt', lineHeight: 1.6 } } },
    ]);
  if (idea.key === 'paper-plain') design.font.display = 'Georgia, serif';
  if (idea.key === 'terminal-contrast')
    for (const part of ['masthead', 'secondary'])
      rules.push([
        part,
        { '@media': { print: { background: '#fff', color: colors.ink } } },
      ]);
  if (idea.key === 'mosaic') {
    rules.push([
      'section:nth-child(3n+2) sectionTitle',
      { borderInlineStart: '3px solid #a92335' },
    ]);
    rules.push([
      'section:nth-child(3n) sectionTitle',
      { borderInlineStart: '3px solid #215c47' },
    ]);
  }
  const source = rules
    .map(([selector, css]) => {
      const target =
        selector === 'page'
          ? '.${design}[data-theme]'
          : '.${design}[data-theme] ' +
            selector
              .split(' ')
              .map(
                (part) =>
                  '.${c.' +
                  part.replace(/:.*/, '') +
                  '}' +
                  (part.includes(':') ? part.slice(part.indexOf(':')) : '')
              )
              .join(' ');
      return `globalStyle(\`${target}\`, ${cssSource(css, idea)});`;
    })
    .join('\n');
  const monochrome =
    idea.color === 'multi' || ['dots', 'squares'].includes(r.decoration ?? '')
      ? 'globalStyle(`.${design}[data-theme][data-monochrome="true"] .${c.masthead}::before`, { boxShadow: "none" });\nglobalStyle(`.${design}[data-theme][data-monochrome="true"] .${c.section} .${c.sectionTitle}`, { borderColor: "currentColor" });'
      : '';
  return `import { createTheme, globalStyle } from '@vanilla-extract/css';\nimport { tokens, defaults, classes as c } from '@jsonresume/theme-primitives';\n\nexport const design = createTheme(tokens, { ...defaults, ${JSON.stringify(
    design
  ).slice(1, -1)} });\n${source}\n${monochrome}\n`;
}
function cssSource(value: unknown, idea: PortfolioIdea): string {
  if (typeof value === 'string') {
    let result = value;
    for (const [key, color] of Object.entries(idea.palette))
      result = result.replaceAll(color, '${tokens.color.' + key + '}');
    return result.includes('${') ? '`' + result + '`' : JSON.stringify(value);
  }
  if (Array.isArray(value))
    return '[' + value.map((v) => cssSource(v, idea)).join(',') + ']';
  if (value && typeof value === 'object')
    return (
      '{' +
      Object.entries(value)
        .map(([key, v]) => JSON.stringify(key) + ':' + cssSource(v, idea))
        .join(',') +
      '}'
    );
  return JSON.stringify(value);
}
