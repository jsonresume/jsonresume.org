import schemaJson from '@jsonresume/schema/schema.json';
import { history, projects, team } from '@repo/content/data';
import { loadPosts, loadPostWithNeighbours } from '@repo/content/documents';
import { facts } from '@repo/content/facts';
import { cli } from '@repo/content/pages';
import { act, fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { featuredThemes, HomePage } from './home';
import { AiPage } from './pages/ai/AiPage';
import { RegistryPage } from './pages/registry/RegistryPage';
import { BlogIndexPage, BlogPostPage } from './pages/BlogPages';
import { CliPage } from './pages/cli/CliPage';
import { GettingStartedPage } from './pages/getting-started/GettingStartedPage';
import { MediaPage } from './pages/media/MediaPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { SchemaPage } from './pages/schema/SchemaPage';
import { TeamPage } from './pages/TeamPage';
import { ThemeDevelopmentPage } from './pages/theme-development/ThemeDevelopmentPage';
import { SiteLayout } from './SiteLayout';
import { SiteLink } from './SiteLink';
import { renderWithRouter } from './test/renderWithRouter';

const oneH1 = () =>
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);

describe('shell', () => {
  it('SiteLink navigates in-app for site paths and leaves others alone', async () => {
    const { router } = await renderWithRouter(
      <>
        <SiteLink href="/schema">Schema</SiteLink>
        <SiteLink href="https://github.com">GitHub</SiteLink>
      </>
    );
    fireEvent.click(screen.getByRole('link', { name: 'Schema' }));
    await new Promise((r) => setTimeout(r, 0));
    expect(router.state.location.pathname).toBe('/schema');
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com'
    );
  });

  it('SiteLayout marks the current section', async () => {
    await renderWithRouter(
      <SiteLayout>page</SiteLayout>,
      '/blog/first-official-release'
    );
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getByRole('link', { name: 'Blog' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });
});

describe('pages', () => {
  it('home: sections and featured themes', async () => {
    await renderWithRouter(<HomePage />);
    oneH1();
    expect(
      within(
        screen.getByRole('list', { name: 'Featured themes' })
      ).getAllByRole('listitem')
    ).toHaveLength(featuredThemes.length);
  });

  it('getting started: your username rewrites your resume links', async () => {
    await renderWithRouter(<GettingStartedPage />, '/getting-started');
    oneH1();
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Your GitHub username'), {
        target: { value: 'octocat' },
      });
    });
    expect(screen.getByRole('link', { name: '@octocat.json' })).toHaveAttribute(
      'href',
      'https://jsonresume.org/@octocat.json'
    );
  });

  it('schema: an anchor for every section of the schema', async () => {
    await renderWithRouter(<SchemaPage />, '/schema');
    oneH1();
    for (const key of Object.keys(schemaJson.properties).filter(
      (k) => k !== '$schema'
    )) {
      expect(document.getElementById(key)).not.toBeNull();
    }
    expect(
      screen.getByText(`Reference · version ${facts.schemaVersion}`)
    ).toBeInTheDocument();
  });

  it('cli: a section per command', async () => {
    await renderWithRouter(<CliPage />, '/cli');
    oneH1();
    for (const command of cli.commands) {
      expect(
        screen.getByRole('heading', { level: 2, name: command.usage })
      ).toBeInTheDocument();
    }
  });

  it('ai: each tool opens where it lives now', async () => {
    await renderWithRouter(<AiPage />, '/ai');
    oneH1();
    const link = screen.getByRole('link', { name: /Cover letter/ });
    expect(link.getAttribute('href')).toMatch(/^\/dashboard\/pathways\?ask=/);
  });

  it('registry: what moved, what hasn’t, and how to ask', async () => {
    await renderWithRouter(<RegistryPage />, '/registry');
    oneH1();
    expect(
      screen.getByRole('list', { name: 'Moved from the registry' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /The job graph/ }).getAttribute('href')
    ).toContain('issues/new');
  });

  it('theme development and media render, with facts filled in', async () => {
    await renderWithRouter(<ThemeDevelopmentPage />, '/theme-development');
    oneH1();
    const { container } = await renderWithRouter(<MediaPage />, '/media');
    expect(container.textContent).not.toMatch(/\{\{/);
    expect(container.textContent).toContain(facts.schemaVersion);
  });

  it('projects: every project is listed', async () => {
    await renderWithRouter(<ProjectsPage />, '/projects');
    // Cards only: a project may link where the page's closing buttons do.
    const cards = screen
      .getAllByRole('link')
      .filter(
        (a) =>
          a.closest('li') &&
          projects.some((p) => p.link === a.getAttribute('href'))
      );
    expect(cards).toHaveLength(projects.length);
  });

  it('team: people, story and milestones', async () => {
    await renderWithRouter(<TeamPage team={team} history={history} />, '/team');
    oneH1();
    expect(screen.getByRole('list', { name: 'Core team' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: 'A shared format for a familiar document',
      })
    ).toBeInTheDocument();
    expect(screen.getByText('31 July 2014')).toBeInTheDocument();
  });

  it('blog: index by year, and a post with its neighbours', async () => {
    const posts = await loadPosts();
    await renderWithRouter(<BlogIndexPage posts={posts} />, '/blog');
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(
      posts.length
    );
    const result = await loadPostWithNeighbours(posts[1].slug);
    if (!result) throw new Error('post missing');
    await renderWithRouter(
      <BlogPostPage {...result} />,
      `/blog/${posts[1].slug}`
    );
    const more = screen.getByRole('navigation', { name: 'More posts' });
    expect(within(more).getAllByRole('link')).toHaveLength(2);
  });
});
