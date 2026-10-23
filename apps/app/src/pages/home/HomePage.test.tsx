import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from '../../App';
import { featuredThemes, themeCount } from '../../data/themes';
import { matchRoute } from '../../routes';

describe('home page', () => {
  it('has one h1 and a heading for each section', () => {
    render(<App route={matchRoute('/')} />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Your resume, as data.' })
    ).toBeInTheDocument();
    for (const name of [
      'One file, every format',
      'A look for every kind of career',
      'Plain JSON, real tools',
      'Built in the open, by the people who use it',
    ]) {
      expect(
        screen.getByRole('heading', { level: 2, name })
      ).toBeInTheDocument();
    }
  });

  it('links each featured theme to a live preview', () => {
    render(<App route={matchRoute('/')} />);
    const showcase = screen.getByRole('region', {
      name: 'A look for every kind of career',
    });
    const cards = within(showcase).getAllByRole('listitem');
    expect(cards).toHaveLength(featuredThemes.length);
    const first = within(cards[0]).getByRole('link');
    expect(first).toHaveAttribute(
      'href',
      `https://registry.jsonresume.org/thomasdavis?theme=${featuredThemes[0].slug}`
    );
  });

  it('counts the themes from the theme metadata', () => {
    render(<App route={matchRoute('/')} />);
    expect(themeCount).toBeGreaterThan(50);
    expect(
      screen.getByRole('link', { name: `See all ${themeCount} themes` })
    ).toBeInTheDocument();
  });
});

describe('routes', () => {
  it('treats a trailing slash as the same page', () => {
    expect(matchRoute('/').path).toBe('/');
    expect(matchRoute('//').path).toBe('/');
  });

  it('falls back to the not-found page', () => {
    render(<App route={matchRoute('/nope')} />);
    expect(
      screen.getByRole('heading', { name: 'Page not found' })
    ).toBeInTheDocument();
  });
});
