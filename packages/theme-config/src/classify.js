import { THEME_CLASSIFICATION } from './classification.js';
import { THEME_USAGE } from './usage.js';

const retired = new Set(['research-informed']);

/** Keep legacy search terms, but give every theme explicit discovery facets. */
export function classifyMetadata(metadata) {
  return Object.fromEntries(
    Object.entries(metadata).map(([slug, theme]) => {
      const [style, layout, color] = theme.style
        ? [theme.style, theme.layout, theme.color]
        : THEME_CLASSIFICATION[slug] ?? [];
      if (!style || !layout || !color)
        throw new Error(`Missing theme classification: ${slug}`);
      return [
        slug,
        {
          ...theme,
          style,
          layout,
          color,
          tags: [
            ...new Set([
              style,
              layout,
              color,
              ...theme.tags.filter((tag) => !retired.has(tag)),
            ]),
          ],
          usage: THEME_USAGE[slug] ?? {
            resumes: 0,
            chosen: 0,
            inherited: 0,
            views: 0,
          },
        },
      ];
    })
  );
}
