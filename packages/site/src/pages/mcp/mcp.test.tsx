import { mcp } from '@repo/content/pages';
import { act, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { renderWithRouter } from '../../test/renderWithRouter';
import { guideFor } from './ConnectGuides';
import { McpPage } from './McpPage';

afterEach(() => window.history.replaceState(null, '', '/'));

const panel = (name: string) =>
  screen
    .getAllByRole('tabpanel', { hidden: true })
    .find((p) => within(p).queryByRole('heading', { name, hidden: true }));

describe('/mcp connect guides', () => {
  it('has a tab for each main app, Claude first', async () => {
    await renderWithRouter(<McpPage />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    const tabs = within(
      screen.getByRole('tablist', { name: 'Choose your app' })
    ).getAllByRole('tab');
    expect(tabs.map((t) => t.textContent)).toEqual([
      'Claude',
      'ChatGPT',
      'Cursor',
      'Gemini CLI',
      'VS Code',
    ]);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const claude = panel('Claude Code');
    expect(claude).toHaveAttribute('data-state', 'active');
    expect(claude).toHaveTextContent(
      'claude mcp add --transport http jsonresume https://jsonresume.org/mcp'
    );
  });

  it('keeps every app’s steps in the page, showing the chosen one', async () => {
    await renderWithRouter(<McpPage />);
    for (const name of ['ChatGPT', 'Cursor', 'Gemini CLI'])
      expect(panel(name)).toHaveAttribute('data-state', 'inactive');
    const cursor = screen.getByRole('tab', { name: 'Cursor' });
    fireEvent.mouseDown(cursor, { button: 0 });
    expect(cursor).toHaveAttribute('aria-selected', 'true');
    const shown = panel('Cursor');
    expect(shown).toHaveAttribute('data-state', 'active');
    expect(shown).toHaveTextContent('~/.cursor/mcp.json');
    expect(panel('Claude Code')).toHaveAttribute('data-state', 'inactive');
  });

  it('opens the tab a link names', async () => {
    window.history.replaceState(null, '', '/mcp#gemini');
    await renderWithRouter(<McpPage />, '/mcp');
    expect(screen.getByRole('tab', { name: 'Gemini CLI' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(panel('Gemini CLI')).toHaveTextContent(
      'gemini mcp add -s user --transport http jsonresume https://jsonresume.org/mcp'
    );
    await act(async () => {
      window.location.hash = '#vscode-copilot';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(screen.getByRole('tab', { name: 'VS Code' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  it('maps links to tabs, by app or by client', () => {
    expect(guideFor('#claude-code')).toBe('claude');
    expect(guideFor('#chatgpt')).toBe('chatgpt');
    expect(guideFor('#tools')).toBeUndefined();
  });

  it('lists the other apps below the tabs', async () => {
    await renderWithRouter(<McpPage />);
    const more = screen.getByRole('region', { name: 'More apps' });
    for (const client of mcp.others)
      expect(
        within(more).getByRole('heading', { level: 4, name: client.name })
      ).toBeInTheDocument();
  });

  it('gives each main app the exact server URL and an OAuth sign-in', () => {
    for (const guide of mcp.guides)
      for (const client of guide.clients) {
        expect(client.auth).not.toBe('key');
        const text = [...client.steps, client.code?.code ?? ''].join('\n');
        if (client.code || text.includes('jsonresume.org/mcp'))
          expect(text).toContain(mcp.serverUrl);
      }
  });
});
