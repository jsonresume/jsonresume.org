import { describe, it, expect, vi } from 'vitest';
import { createAppKeyHandler } from './appKeyHandler.js';
import { nextTab } from './jobFilters.js';

function makeCtx(overrides = {}) {
  const ctx = {
    view: 'list',
    tab: 'all',
    jobs: [{ id: 1 }, { id: 2 }],
    cursor: 0,
    selectedJob: null,
    inlineSearch: false,
    confirmExit: false,
    ai: { hasActiveProcess: false, cancel: vi.fn() },
    exit: vi.fn(),
    forceRefresh: vi.fn(),
    showToast: vi.fn(),
    setView: vi.fn(),
    setTab: vi.fn(),
    setCursor: vi.fn(),
    setSelectedJob: vi.fn(),
    setInlineSearch: vi.fn(),
    setSearchQuery: vi.fn(),
    setConfirmExit: vi.fn(),
    handleDossier: vi.fn(),
    nextTab,
    ...overrides,
  };
  return ctx;
}

const noKey = {};

describe('createAppKeyHandler', () => {
  it('ignores all input while in modal views', () => {
    const ctx = makeCtx({ view: 'filters' });
    createAppKeyHandler(ctx)('q', noKey);
    expect(ctx.exit).not.toHaveBeenCalled();
  });

  it('ignores input while inline search is active', () => {
    const ctx = makeCtx({ inlineSearch: true });
    createAppKeyHandler(ctx)('q', noKey);
    expect(ctx.exit).not.toHaveBeenCalled();
  });

  it('quits on q in list view when no active process', () => {
    const ctx = makeCtx();
    createAppKeyHandler(ctx)('q', noKey);
    expect(ctx.ai.cancel).toHaveBeenCalled();
    expect(ctx.exit).toHaveBeenCalled();
  });

  it('warns and arms confirmExit on q while dossier running', () => {
    const ctx = makeCtx({ ai: { hasActiveProcess: true, cancel: vi.fn() } });
    createAppKeyHandler(ctx)('q', noKey);
    expect(ctx.showToast).toHaveBeenCalledWith(
      expect.stringContaining('still running'),
      'warning'
    );
    expect(ctx.setConfirmExit).toHaveBeenCalledWith(true);
    expect(ctx.exit).not.toHaveBeenCalled();
  });

  it('quits on second q after confirm', () => {
    const ctx = makeCtx({
      ai: { hasActiveProcess: true, cancel: vi.fn() },
      confirmExit: true,
    });
    createAppKeyHandler(ctx)('q', noKey);
    expect(ctx.exit).toHaveBeenCalled();
  });

  it('q in detail view returns to list', () => {
    const ctx = makeCtx({ view: 'detail' });
    createAppKeyHandler(ctx)('q', noKey);
    expect(ctx.setView).toHaveBeenCalledWith('list');
  });

  it('resets confirmExit on any non-q key', () => {
    const ctx = makeCtx();
    createAppKeyHandler(ctx)('R', noKey);
    expect(ctx.setConfirmExit).toHaveBeenCalledWith(false);
  });

  it('R refreshes and toasts', () => {
    const ctx = makeCtx();
    createAppKeyHandler(ctx)('R', noKey);
    expect(ctx.forceRefresh).toHaveBeenCalled();
    expect(ctx.showToast).toHaveBeenCalledWith('Refreshing…', 'info');
  });

  it('f opens filters, / opens searches, ? opens help', () => {
    const ctx = makeCtx();
    const handler = createAppKeyHandler(ctx);
    handler('f', noKey);
    handler('/', noKey);
    handler('?', noKey);
    expect(ctx.setView).toHaveBeenCalledWith('filters');
    expect(ctx.setView).toHaveBeenCalledWith('searches');
    expect(ctx.setView).toHaveBeenCalledWith('help');
  });

  it('n opens inline search in list view', () => {
    const ctx = makeCtx();
    createAppKeyHandler(ctx)('n', noKey);
    expect(ctx.setInlineSearch).toHaveBeenCalledWith(true);
    expect(ctx.setSearchQuery).toHaveBeenCalledWith('');
  });

  it('Enter opens detail for the cursored job', () => {
    const ctx = makeCtx();
    createAppKeyHandler(ctx)('', { return: true });
    expect(ctx.setSelectedJob).toHaveBeenCalledWith({ id: 1 });
    expect(ctx.setView).toHaveBeenCalledWith('detail');
  });

  it('c in detail view triggers a dossier for the selected job', () => {
    const job = { id: 9 };
    const ctx = makeCtx({ view: 'detail', selectedJob: job });
    createAppKeyHandler(ctx)('c', noKey);
    expect(ctx.handleDossier).toHaveBeenCalledWith(job);
  });

  it('Escape in ai view returns to detail when a job is selected', () => {
    const ctx = makeCtx({ view: 'ai', selectedJob: { id: 1 } });
    createAppKeyHandler(ctx)('', { escape: true });
    expect(ctx.setView).toHaveBeenCalledWith('detail');
  });

  it('Tab cycles forward and resets cursor', () => {
    const ctx = makeCtx();
    createAppKeyHandler(ctx)('', { tab: true });
    expect(ctx.setTab).toHaveBeenCalledWith('new');
    expect(ctx.setCursor).toHaveBeenCalledWith(0);
  });

  it('Shift+Tab cycles backward (last setTab wins)', () => {
    const ctx = makeCtx({ tab: 'new' });
    createAppKeyHandler(ctx)('', { tab: true, shift: true });
    // both branches fire; backward call is last → 'all'
    expect(ctx.setTab).toHaveBeenLastCalledWith('all');
  });
});
