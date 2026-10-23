import {
  facts,
  history,
  loadDoc,
  loadPosts,
  projectCategories,
  projects,
  team,
} from '@repo/content';
import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { featuredThemes, HomePage } from './home';
import { BlogIndexPage, BlogPostPage } from './pages/BlogPages';
import { DocPage } from './pages/DocPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { TeamPage } from './pages/TeamPage';
import { SiteLayout } from './SiteLayout';
import { SiteLink } from './SiteLink';
import { renderWithRouter } from './test/renderWithRouter';

describe('SiteLink', () => {
  it('navigates in-app for same-site paths and leaves external links alone', async () => {
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
});

describe('SiteLayout', () => {
  it('marks the current section in the header', async () => {
    await renderWithRouter(
      <SiteLayout>page</SiteLayout>,
      '/blog/first-official-release'
    );
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getByRole('link', { name: 'Blog' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(
      within(nav).getByRole('link', { name: 'Schema' })
    ).not.toHaveAttribute('aria-current');
  });
});

describe('HomePage', () => {
  it('has one h1, every section and the featured themes', async () => {
    await renderWithRouter(<HomePage />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    for (const name of [
      'One file, every format',
      'A look for every kind of career',
      'Plain JSON, real tools',
    ]) {
      expect(
        screen.getByRole('heading', { level: 2, name })
      ).toBeInTheDocument();
    }
    const featured = screen.getByRole('list', { name: 'Featured themes' });
    expect(within(featured).getAllByRole('listitem')).toHaveLength(
      featuredThemes.length
    );
    expect(
      screen.getByRole('link', { name: `See all ${facts.themeCount} themes` })
    ).toHaveAttribute('href', '/themes');
  });
});

describe('page templates', () => {
  it('renders a document with facts filled in', async () => {
    const media = await loadDoc('media');
    expect(media).toBeDefined();
    if (!media) return;
    const { container } = await renderWithRouter(<DocPage doc={media} />);
    expect(
      screen.getByRole('heading', { level: 1, name: media.title })
    ).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/\{\{/);
    expect(container.textContent).toContain(facts.schemaVersion);
  });

  it('lists every post and renders one', async () => {
    const posts = await loadPosts();
    await renderWithRouter(<BlogIndexPage posts={posts} />);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(
      posts.length
    );
    await renderWithRouter(<BlogPostPage post={posts[0]} />);
    expect(
      screen.getByRole('heading', { level: 1, name: posts[0].title })
    ).toBeInTheDocument();
  });

  it('groups every project under a category heading', async () => {
    await renderWithRouter(
      <ProjectsPage projects={projects} categories={projectCategories} />
    );
    const cards = screen
      .getAllByRole('link')
      .filter((a) => projects.some((p) => p.link === a.getAttribute('href')));
    expect(cards).toHaveLength(projects.length);
  });

  it('shows the team and the dated history', async () => {
    await renderWithRouter(<TeamPage team={team} history={history} />);
    expect(screen.getByRole('list', { name: 'Core team' })).toBeInTheDocument();
    expect(screen.getByText('31 July 2014')).toBeInTheDocument();
  });
});
