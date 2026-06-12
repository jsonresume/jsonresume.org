/**
 * Keyboard dispatch for the main App view (list / detail / ai).
 * Returns the (input, key) handler passed to Ink's useInput. All state lives in
 * App; this module only routes keypresses to the supplied actions/setters so
 * the routing rules stay in one cohesive, reviewable place.
 */

export function createAppKeyHandler(ctx) {
  const {
    view,
    tab,
    jobs,
    cursor,
    selectedJob,
    inlineSearch,
    confirmExit,
    ai,
    exit,
    forceRefresh,
    showToast,
    setView,
    setTab,
    setCursor,
    setSelectedJob,
    setInlineSearch,
    setSearchQuery,
    setConfirmExit,
    handleDossier,
    nextTab,
  } = ctx;

  return (input, key) => {
    if (view === 'filters' || view === 'searches' || view === 'help') return;
    if (inlineSearch) return;

    if (input === 'q' && view === 'list') {
      if (ai.hasActiveProcess && !confirmExit) {
        showToast(
          'Claude dossier still running — press q again to quit',
          'warning'
        );
        setConfirmExit(true);
        return;
      }
      ai.cancel();
      exit();
    }
    if (input !== 'q') setConfirmExit(false);
    if (input === 'q' && view === 'detail') setView('list');
    if (input === 'R' && (view === 'list' || view === 'detail')) {
      forceRefresh();
      showToast('Refreshing…', 'info');
    }
    if (input === 'f' && (view === 'list' || view === 'detail'))
      setView('filters');
    if (input === '/' && (view === 'list' || view === 'detail'))
      setView('searches');
    if (input === '?' && (view === 'list' || view === 'detail'))
      setView('help');
    if (input === 'n' && view === 'list') {
      setInlineSearch(true);
      setSearchQuery('');
    }

    // Enter toggles detail panel
    if (key.return && view === 'list' && jobs[cursor]) {
      setSelectedJob(jobs[cursor]);
      setView('detail');
    }
    if (key.escape && view === 'detail') setView('list');
    if (input === 'c' && view === 'detail' && selectedJob) {
      handleDossier(selectedJob);
    }

    if (key.escape && view === 'ai') {
      // Don't kill running dossier — just hide the panel
      setView(selectedJob ? 'detail' : 'list');
    }

    if (key.tab && (view === 'list' || view === 'detail')) {
      setTab(nextTab(tab, 1));
      setCursor(0);
    }
    if (key.shift && key.tab && (view === 'list' || view === 'detail')) {
      setTab(nextTab(tab, -1));
      setCursor(0);
    }
  };
}
