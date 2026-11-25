import { facts } from '@repo/content/facts';
import { expect, it } from 'vitest';
import { homeRoute } from './routes/pages';

it('quotes the same numbers in heads as the content does', () => {
  expect(__THEME_COUNT__).toBe(facts.themeCount);
  expect(__SCHEMA_VERSION__).toBe(facts.schemaVersion);
  expect(JSON.stringify(homeRoute.options.head?.({} as never))).toContain(
    `${facts.themeCount} open-source themes`
  );
});
