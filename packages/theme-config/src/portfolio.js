import classic from './portfolio-classic.js';
import minimal from './portfolio-minimal.js';
import modern from './portfolio-modern.js';
import editorial from './portfolio-editorial.js';
import technical from './portfolio-technical.js';
import bold from './portfolio-bold.js';
import creative from './portfolio-creative.js';
import retro from './portfolio-retro.js';
import playful from './portfolio-playful.js';

/** Original portfolio designs; public usage remains zero until measured. */
export const PORTFOLIO_THEME_METADATA = Object.fromEntries(
  [
    ...classic.map((row) => [row, 'classic']),
    ...minimal.map((row) => [row, 'minimal']),
    ...modern.map((row) => [row, 'modern']),
    ...editorial.map((row) => [row, 'editorial']),
    ...technical.map((row) => [row, 'technical']),
    ...bold.map((row) => [row, 'bold']),
    ...creative.map((row) => [row, 'creative']),
    ...retro.map((row) => [row, 'retro']),
    ...playful.map((row) => [row, 'playful']),
  ].map(([[slug, name, description, layout, color, audience], style]) => [
    slug,
    {
      name,
      description,
      style,
      layout,
      color,
      author: 'JSON Resume Team',
      tags: [audience.toLowerCase()],
    },
  ])
);
