import { readFileSync } from 'node:fs';
import { Schema } from 'effect';
import { fontPair, type FontPair } from './fonts.ts';
import { palette, type Palette } from './palettes.ts';

export const portfolioStyles = [
  'classic',
  'minimal',
  'modern',
  'editorial',
  'technical',
  'bold',
  'creative',
  'retro',
  'playful',
] as const;

const Idea = Schema.Struct({
  name: Schema.String,
  style: Schema.String,
  layout: Schema.String,
  color: Schema.String,
  anchor: Schema.String,
  audience: Schema.String,
  brief: Schema.String,
  key: Schema.String,
  wave: Schema.Number,
  language: Schema.String,
});

export type PortfolioIdea = typeof Idea.Type & {
  slug: string;
  index: number;
  fonts: FontPair;
  palette: Palette;
};

export function portfolioIdeas(): PortfolioIdea[] {
  const ideas = portfolioStyles.flatMap((style) => {
    const rows = Schema.decodeUnknownSync(
      Schema.Array(Schema.Array(Schema.Unknown))
    )(JSON.parse(readFileSync(`docs/theme-roadmap/${style}.json`, 'utf8')));
    return rows.map((row, index) => {
      const idea = Schema.decodeUnknownSync(Idea)({
        name: row[0],
        style,
        layout: row[1],
        color: row[2],
        anchor: row[3],
        audience: row[4],
        brief: row[5],
        key: row[6],
        wave: row[7],
        language: row[8] ?? 'en',
      });
      return {
        ...idea,
        index,
        slug: idea.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
        fonts: fontPair(style, index, idea.key, idea.language),
        palette: palette(idea.color, index),
      };
    });
  });
  if (
    ideas.length !== 150 ||
    new Set(ideas.map((idea) => idea.slug)).size !== 150
  )
    throw new Error('The portfolio must contain exactly 150 distinct themes.');
  return ideas;
}
