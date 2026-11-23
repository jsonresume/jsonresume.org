import { describe, expect, it } from 'vitest';
import { facts } from './facts';
import { llmsFullTxt, llmsTxt } from './llms';

const site = 'https://jsonresume.org';

describe('llms.txt', () => {
  const text = llmsTxt(
    site,
    [
      {
        name: 'get_resume',
        group: 'resume',
        description: 'Your resume as JSON Resume. More detail here.',
      },
      {
        name: 'list_marked_jobs',
        group: 'resume',
        description: 'Marked jobs, one mark (e.g. applied) at a time. More.',
      },
      { name: 'list_themes', group: 'themes', description: 'Every theme.' },
    ],
    [
      { key: 'resume', title: 'Your resume' },
      { key: 'themes', title: 'Themes' },
      { key: 'apps', title: 'Connected apps' },
    ]
  );

  it('follows llmstxt.org: a title, a summary, then sections of links', () => {
    const lines = text.split('\n');
    expect(lines[0]).toBe('# JSON Resume');
    expect(lines[2]?.startsWith('> ')).toBe(true);
    expect(text).toContain('## Specification');
    expect(text).toContain('## For agents');
  });

  it('states the facts the packages own', () => {
    expect(text).toContain(`schema version ${facts.schemaVersion}`);
    expect(text).toContain(`${facts.themeCount} open-source themes`);
  });

  it('lists MCP tools by group, with the first sentence of each', () => {
    expect(text).toContain(
      '  - Your resume:\n    - `get_resume`: Your resume as JSON Resume.\n'
    );
    expect(text).toContain('    - `list_themes`: Every theme.');
    expect(text).toContain(
      '`list_marked_jobs`: Marked jobs, one mark (e.g. applied) at a time.'
    );
    expect(text).not.toContain('Connected apps:');
  });

  it('links only absolute URLs', () => {
    const links = [...text.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1] ?? '');
    expect(links.length).toBeGreaterThan(10);
    expect(links.filter((l) => !l.startsWith('https://'))).toEqual([]);
  });
});

describe('llms-full.txt', () => {
  it('holds all three specifications with absolute links', async () => {
    const text = await llmsFullTxt(site);
    expect(text).toContain('# JSON Resume specification');
    expect(text).toContain('# Job description specification');
    expect(text).toContain('# Company specification');
    expect(text).toContain('](https://jsonresume.org/schema.json)');
    expect(text).not.toMatch(/\]\(\//);
  });
});
