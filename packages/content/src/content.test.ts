import { describe, expect, it } from 'vitest';
import {
  docSlugs,
  factNames,
  fillFacts,
  history,
  parseFrontMatter,
  loadDoc,
  loadDocs,
  loadPosts,
  placeholdersIn,
  postSlugs,
  projectCategories,
  projects,
  team,
} from './index';

describe('front matter', () => {
  it('splits flat key: value front matter from the body', () => {
    const { data, body } = parseFrontMatter(
      "---\ntitle: 'Hello: world'\ndate: 2014-07-31\n---\n\nBody text\n"
    );
    expect(data).toEqual({ title: 'Hello: world', date: '2014-07-31' });
    expect(body).toBe('Body text\n');
  });

  it('rejects a document without front matter', () => {
    expect(() => parseFrontMatter('# Title')).toThrow('Missing front matter');
  });
});

describe('facts', () => {
  const facts = {
    themeCount: 1234,
    schemaSectionCount: 12,
    schemaVersion: '1.2.0',
  };

  it('fills known placeholders and formats numbers', () => {
    expect(
      fillFacts('{{themeCount}} themes, v{{ schemaVersion }}', facts)
    ).toBe('1,234 themes, v1.2.0');
  });

  it('refuses unknown placeholders', () => {
    expect(() => fillFacts('{{userCount}}', facts)).toThrow();
  });
});

describe('data', () => {
  it('decodes every project into a known category', () => {
    expect(projects.length).toBeGreaterThan(50);
    for (const project of projects) {
      expect(projectCategories).toContain(project.category);
    }
  });

  it('has the team and a dated, sorted history', () => {
    expect(team.coreTeam.length).toBeGreaterThan(0);
    const dates = history.map((event) => event.date);
    expect(dates).toEqual([...dates].sort());
  });
});

const docs = await loadDocs();
const posts = await loadPosts();
const all = [...docs, ...posts];

describe('documents', () => {
  it('loads every document and post, newest post first', async () => {
    expect(docs.map((d) => d.slug).sort()).toEqual([...docSlugs].sort());
    expect(posts).toHaveLength(postSlugs.length);
    const dates = posts.map((post) => post.date);
    expect(dates).toEqual([...dates].sort().reverse());
    expect(await loadDoc('no-such-doc')).toBeUndefined();
  });

  it.each(all.map((doc) => [doc.slug, doc.body] as const))(
    '%s is plain Markdown under the page title',
    (_slug, body) => {
      const prose = body.replace(/```[\s\S]*?```/g, '');
      expect(prose).not.toMatch(/^# /m);
      expect(prose).not.toMatch(/<\/?[a-z][a-z0-9]*(\s[^>]*)?>/i);
      for (const name of placeholdersIn(body)) {
        expect(factNames).toContain(name);
      }
    }
  );
});

import { facts } from './index';

describe('computed facts', () => {
  it('reads the theme count and schema from their packages', () => {
    expect(facts.themeCount).toBeGreaterThan(50);
    expect(facts.schemaSectionCount).toBeGreaterThanOrEqual(12);
    expect(facts.schemaVersion).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('fills every document without errors', () => {
    for (const doc of all) {
      expect(fillFacts(doc.body, facts)).not.toMatch(/\{\{/);
    }
  });
});

import { BlogPost, Doc, HistoryEvent, Project, Team } from '@repo/domain';
import { Schema } from 'effect';

describe('schema validation', () => {
  // Explicit, so it holds whether or not the module decoded at load (SSR only).
  it('every piece of content matches its schema', () => {
    expect(() =>
      Schema.decodeUnknownSync(Schema.Array(Project))(projects)
    ).not.toThrow();
    expect(() => Schema.decodeUnknownSync(Team)(team)).not.toThrow();
    expect(() =>
      Schema.decodeUnknownSync(Schema.Array(HistoryEvent))(history)
    ).not.toThrow();
    expect(() =>
      Schema.decodeUnknownSync(Schema.Array(Doc))(docs)
    ).not.toThrow();
    expect(() =>
      Schema.decodeUnknownSync(Schema.Array(BlogPost))(posts)
    ).not.toThrow();
  });
});
