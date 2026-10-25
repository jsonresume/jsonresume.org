import { Schema } from 'effect';
import { describe, expect, it } from 'vitest';
import { BlogPost, HistoryEvent, Project, Slug } from './index';

describe('domain schemas', () => {
  it('accepts a valid project and rejects an unknown category', () => {
    const project = {
      name: 'resumed',
      description: 'A lightweight builder.',
      link: 'https://github.com/rbardini/resumed',
      category: 'cli',
      language: 'TypeScript',
    };
    expect(Schema.decodeUnknownSync(Project)(project)).toEqual(project);
    expect(() =>
      Schema.decodeUnknownSync(Project)({ ...project, category: 'spaceship' })
    ).toThrow();
  });

  it('requires ISO dates and sourced history', () => {
    const event = {
      date: '2014-07-31',
      title: 'First release',
      description: 'Version 0.0.0.',
      href: '/blog/first-official-release',
      source: 'Announcement',
    };
    expect(Schema.decodeUnknownSync(HistoryEvent)(event)).toEqual(event);
    expect(() =>
      Schema.decodeUnknownSync(HistoryEvent)({ ...event, date: '31 July 2014' })
    ).toThrow();
  });

  it('keeps slugs URL-safe', () => {
    expect(Schema.is(Slug)('first-official-release')).toBe(true);
    expect(Schema.is(Slug)('First Release')).toBe(false);
  });

  it('decodes a blog post with optional description', () => {
    const post = Schema.decodeUnknownSync(BlogPost)({
      title: 'Hello',
      date: '2019-06-27',
      author: 'Thomas Davis',
      slug: 'hello',
      body: 'Text',
    });
    expect(post.description).toBeUndefined();
  });
});
