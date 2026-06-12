import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { render, Box, useInput, useApp } from 'ink';
import { h } from './h.js';
import { createApiClient } from '../api.js';
import {
  loadFilters,
  saveFilters,
  getFiltersForSearch,
  setFiltersForSearch,
} from '../filters.js';
import { exportShortlist } from '../export.js';
import { useJobs } from './useJobs.js';
import { useAI } from './useAI.js';
import { useSearches } from './useSearches.js';
import { useToast } from './Toast.js';
import Toast from './Toast.js';
import Header from './Header.js';
import JobList from './JobList.js';
import JobDetail from './JobDetail.js';
import FilterManager from './FilterManager.js';
import SearchManager from './SearchManager.js';
import StatusBar from './StatusBar.js';
import AIPanel from './AIPanel.js';
import HelpModal from './HelpModal.js';
import { InlineSearch, SplitPane } from './SplitPane.js';
import {
  TABS,
  TAB_LABELS,
  nextTab,
  filterJobsByQuery,
  computeCounts,
} from './jobFilters.js';
import { createAppKeyHandler } from './appKeyHandler.js';

function App({ baseUrl, apiKey, apiClient }) {
  const { exit } = useApp();
  const api = useMemo(
    () => apiClient || createApiClient({ baseUrl, apiKey }),
    [baseUrl, apiKey, apiClient]
  );

  // View: 'list' | 'detail' | 'filters' | 'searches' | 'ai' | 'help'
  const [view, setView] = useState('list');
  const [tab, setTab] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [cursor, setCursor] = useState(0);
  const [resume, setResume] = useState(null);

  // Inline search
  const [inlineSearch, setInlineSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  // Active search profile
  const [activeSearchId, setActiveSearchId] = useState(null);

  const searchesHook = useSearches(api);

  // Persistent filters (local + server sync for search profiles)
  const [filterStore, setFilterStore] = useState(() => loadFilters());
  const activeFilters = useMemo(
    () => getFiltersForSearch(filterStore, activeSearchId),
    [filterStore, activeSearchId]
  );
  const updateFilters = useCallback(
    (newActive) => {
      setFilterStore((prev) => {
        const next = setFiltersForSearch(prev, activeSearchId, newActive);
        saveFilters(next);
        return next;
      });
      // Sync to server for search profiles
      if (activeSearchId) {
        searchesHook.updateFilters(activeSearchId, newActive);
      }
    },
    [activeSearchId, searchesHook]
  );
  const filterState = useMemo(
    () => ({ active: activeFilters }),
    [activeFilters]
  );
  const persistFilters = useCallback(
    (s) => updateFilters(s.active),
    [updateFilters]
  );

  // Sync server-side filters into local store when search profiles load
  useEffect(() => {
    if (!searchesHook.searches.length) return;
    setFilterStore((prev) => {
      let updated = prev;
      for (const s of searchesHook.searches) {
        if (s.filters?.length && !prev.searches?.[s.id]) {
          updated = setFiltersForSearch(updated, s.id, s.filters);
        }
      }
      if (updated !== prev) saveFilters(updated);
      return updated;
    });
  }, [searchesHook.searches]);

  const ai = useAI(resume);
  const {
    jobs: rawJobs,
    allJobs,
    loading,
    reranking,
    error,
    markJob,
    forceRefresh,
  } = useJobs(api, activeFilters, tab, activeSearchId, ai.getDossierStatus);
  const { toast, show: showToast } = useToast();
  const [confirmExit, setConfirmExit] = useState(false);

  // Seed dossier icons from server-side flags when jobs load
  useEffect(() => {
    if (allJobs.length) ai.seedDossierFlags(allJobs);
  }, [allJobs, ai]);

  // Kill claude processes on exit (Ctrl+C)
  useEffect(() => {
    const cleanup = () => ai.cancel();
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    return () => {
      process.removeListener('SIGINT', cleanup);
      process.removeListener('SIGTERM', cleanup);
    };
  }, [ai]);

  // Apply inline search filter
  const jobs = useMemo(
    () => filterJobsByQuery(rawJobs, appliedQuery),
    [rawJobs, appliedQuery]
  );

  useEffect(() => {
    api
      .fetchMe()
      .then((d) => setResume(d.resume))
      .catch(() => {});
  }, [api]);

  // Update selectedJob when cursor moves or jobs list changes in detail view
  useEffect(() => {
    if (view === 'detail' && jobs[cursor]) {
      setSelectedJob(jobs[cursor]);
    }
  }, [cursor, view, jobs]);

  const handleSelect = (job) => {
    setSelectedJob(job);
    setView('detail');
  };

  const handleMark = async (id, state) => {
    await markJob(id, state);
    const job = allJobs.find((j) => j.id === id);
    const title = job ? job.title : `#${id}`;
    const labels = {
      interested: 'interested',
      applied: 'applied',
      maybe: 'maybe',
      not_interested: 'passed',
    };
    showToast(`${title} → ${labels[state] || state}`, state);
  };

  const handleAISummary = (job) => {
    setSelectedJob(job);
    setView('ai');
    ai.summarizeJob(job);
  };
  const handleDossier = (job) => {
    setSelectedJob(job);
    setView('ai');
    ai.dossier(job, api);
  };
  const handleAIBatch = (visibleJobs) => {
    setView('ai');
    ai.batchReview(visibleJobs);
  };
  const handleBack = () => setView('list');
  const handleExport = () => {
    try {
      const filename = exportShortlist(allJobs);
      showToast(`Saved ./${filename}`, 'export');
    } catch (err) {
      showToast(`Export failed: ${err.message}`, 'error');
    }
  };

  const handleCreateSearch = async (name, prompt) => {
    const search = await searchesHook.create(name, prompt);
    setActiveSearchId(search.id);
  };
  const handleDeleteSearch = async (id) => {
    await searchesHook.remove(id);
    if (activeSearchId === id) setActiveSearchId(null);
  };
  const handleSwitchSearch = (id) => {
    setActiveSearchId(id);
    setCursor(0);
  };

  // Inline search escape handler
  useInput(
    (input, key) => {
      if (key.escape) {
        setInlineSearch(false);
        setSearchQuery('');
        setAppliedQuery('');
      }
    },
    { isActive: inlineSearch }
  );

  // Main input handler
  useInput(
    createAppKeyHandler({
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
    }),
    { isActive: view !== 'filters' && view !== 'searches' && view !== 'help' }
  );

  const activeSearch = activeSearchId
    ? searchesHook.searches.find((s) => s.id === activeSearchId)
    : null;

  const counts = computeCounts(allJobs, ai.getDossierStatus);
  const toastEl = toast ? h(Toast, { toast }) : null;

  // ── Layout ──────────────────────────────────────────

  const header = h(Header, {
    tab,
    tabs: TABS,
    tabLabels: TAB_LABELS,
    counts,
    filters: activeFilters,
    searchName: activeSearch?.name || null,
    appliedQuery,
  });

  const statusBar = h(StatusBar, {
    view: inlineSearch ? 'search' : view,
    jobCount: jobs.length,
    totalCount: allJobs.length,
    loading,
    reranking,
    error,
    aiEnabled: ai.hasKey,
    toast: toastEl,
  });

  // Shared left-pane list props for split-pane views.
  const baseListProps = {
    jobs,
    cursor,
    tab,
    onCursorChange: setCursor,
    onSelect: handleSelect,
    onMark: handleMark,
    onAISummary: handleAISummary,
    onDossier: handleDossier,
    getDossierStatus: ai.getDossierStatus,
  };

  // Split-pane: compact list on left, detail on right
  if (view === 'detail' && selectedJob) {
    return h(SplitPane, {
      header,
      statusBar,
      listProps: { ...baseListProps, isActive: true },
      right: h(JobDetail, {
        job: selectedJob,
        api,
        onBack: handleBack,
        onMark: handleMark,
        onAISummary: handleAISummary,
        onDossier: handleDossier,
        getDossierStatus: ai.getDossierStatus,
        isActive: false,
        isPanel: true,
      }),
    });
  }

  // Split-pane: compact list on left, AI/dossier on right
  if (view === 'ai' && selectedJob) {
    return h(SplitPane, {
      header,
      statusBar,
      listProps: { ...baseListProps, isActive: false },
      right: h(AIPanel, {
        text: ai.text,
        loading: ai.loading,
        error: ai.error,
        mode: ai.mode,
        job: selectedJob,
        onMark: handleMark,
        onDismiss: () => {
          setView(selectedJob ? 'detail' : 'list');
        },
        onExport: () => {
          const f = ai.exportDossier(selectedJob);
          if (f) showToast(`Saved ./${f}`, 'export');
          return f;
        },
        onRegenerate: (job) => {
          ai.regenerateDossier(job, api);
          showToast('Regenerating dossier…', 'info');
        },
        isActive: true,
      }),
    });
  }

  // Full-width list view
  return h(
    Box,
    { flexDirection: 'column', height: process.stdout.rows || 40 },
    header,
    view === 'list'
      ? h(JobList, {
          ...baseListProps,
          onAIBatch: handleAIBatch,
          onExport: handleExport,
          isActive: !inlineSearch,
          reservedRows: 10,
        })
      : null,
    view === 'list' && inlineSearch
      ? h(InlineSearch, {
          query: searchQuery,
          onChange: setSearchQuery,
          onSubmit: () => {
            setAppliedQuery(searchQuery);
            setInlineSearch(false);
            setCursor(0);
          },
        })
      : null,
    view === 'filters'
      ? h(FilterManager, {
          filterState,
          onUpdate: persistFilters,
          onClose: () => setView('list'),
        })
      : null,
    view === 'searches'
      ? h(SearchManager, {
          searches: searchesHook.searches,
          activeSearchId,
          onSwitch: handleSwitchSearch,
          onCreate: handleCreateSearch,
          onDelete: handleDeleteSearch,
          onClose: () => setView('list'),
        })
      : null,
    view === 'ai' && !selectedJob
      ? h(AIPanel, {
          text: ai.text,
          loading: ai.loading,
          error: ai.error,
          mode: ai.mode,
          onDismiss: () => {
            ai.clear();
            setView('list');
          },
          isActive: true,
        })
      : null,
    view === 'help' ? h(HelpModal, { onClose: () => setView('list') }) : null,
    statusBar
  );
}

export default function runTUI({ baseUrl, apiKey, apiClient }) {
  render(h(App, { baseUrl, apiKey, apiClient }));
}
