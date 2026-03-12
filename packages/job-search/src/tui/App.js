import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { render, Box, Text, useInput, useApp } from 'ink';
import TextInput from 'ink-text-input';
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

const TABS = ['all', 'interested', 'applied', 'maybe', 'passed'];
const TAB_LABELS = {
  all: 'All',
  interested: 'Interested',
  applied: 'Applied',
  maybe: 'Maybe',
  passed: 'Passed',
};

function InlineSearch({ query, onChange, onSubmit }) {
  return h(
    Box,
    { paddingX: 1 },
    h(Text, { color: 'yellow', bold: true }, 'Find: '),
    h(TextInput, { value: query, onChange, onSubmit })
  );
}

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

  // Persistent filters
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
    },
    [activeSearchId]
  );
  const filterState = useMemo(
    () => ({ active: activeFilters }),
    [activeFilters]
  );
  const persistFilters = useCallback(
    (s) => updateFilters(s.active),
    [updateFilters]
  );

  const {
    jobs: rawJobs,
    allJobs,
    loading,
    reranking,
    error,
    markJob,
    forceRefresh,
  } = useJobs(api, activeFilters, tab, activeSearchId);
  const ai = useAI(resume);
  const searchesHook = useSearches(api);
  const { toast, show: showToast } = useToast();

  // Apply inline search filter
  const jobs = useMemo(() => {
    if (!appliedQuery) return rawJobs;
    const q = appliedQuery.toLowerCase();
    return rawJobs.filter((j) => JSON.stringify(j).toLowerCase().includes(q));
  }, [rawJobs, appliedQuery]);

  useEffect(() => {
    api
      .fetchMe()
      .then((d) => setResume(d.resume))
      .catch(() => {});
  }, [api]);

  // Update selectedJob when cursor moves in detail view
  useEffect(() => {
    if (view === 'detail' && jobs[cursor]) {
      setSelectedJob(jobs[cursor]);
    }
  }, [cursor, view]);

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
    (input, key) => {
      if (view === 'filters' || view === 'searches' || view === 'help') return;
      if (inlineSearch) return;

      if (input === 'q' && view === 'list') exit();
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

      if (key.escape && view === 'ai') {
        ai.clear();
        setView(selectedJob ? 'detail' : 'list');
      }

      if (key.tab && (view === 'list' || view === 'detail')) {
        const idx = TABS.indexOf(tab);
        setTab(TABS[(idx + 1) % TABS.length]);
        setCursor(0);
      }
      if (key.shift && key.tab && (view === 'list' || view === 'detail')) {
        const idx = TABS.indexOf(tab);
        setTab(TABS[(idx - 1 + TABS.length) % TABS.length]);
        setCursor(0);
      }
    },
    { isActive: view !== 'filters' && view !== 'searches' && view !== 'help' }
  );

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
  const handleAIBatch = (visibleJobs) => {
    setView('ai');
    ai.batchReview(visibleJobs);
  };
  const handleBack = () => setView('list');
  const handleExport = () => {
    try {
      const filename = exportShortlist(allJobs);
      showToast(`Exported to ${filename}`, 'export');
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

  const activeSearch = activeSearchId
    ? searchesHook.searches.find((s) => s.id === activeSearchId)
    : null;

  const counts = {
    all: allJobs.length,
    interested: allJobs.filter((j) => j.state === 'interested').length,
    applied: allJobs.filter((j) => j.state === 'applied').length,
    maybe: allJobs.filter((j) => j.state === 'maybe').length,
    passed: allJobs.filter((j) => j.state === 'not_interested').length,
  };

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

  // Split-pane: compact list on left, detail on right
  if (view === 'detail' && selectedJob) {
    return h(
      Box,
      { flexDirection: 'column', height: process.stdout.rows || 40 },
      header,
      h(
        Box,
        { flexGrow: 1, flexDirection: 'row' },
        // Left pane: compact job list
        h(
          Box,
          {
            flexDirection: 'column',
            width: '40%',
            borderStyle: 'single',
            borderColor: 'gray',
            borderRight: true,
            borderLeft: false,
            borderTop: false,
            borderBottom: false,
          },
          h(JobList, {
            jobs,
            cursor,
            tab,
            onCursorChange: setCursor,
            onSelect: handleSelect,
            onMark: handleMark,
            isActive: true,
            compact: true,
            reservedRows: 8,
          })
        ),
        // Right pane: job detail
        h(
          Box,
          { flexDirection: 'column', width: '60%' },
          h(JobDetail, {
            job: selectedJob,
            api,
            onBack: handleBack,
            onMark: handleMark,
            onAISummary: handleAISummary,
            isActive: false,
            isPanel: true,
          })
        )
      ),
      statusBar
    );
  }

  // Full-width list view
  return h(
    Box,
    { flexDirection: 'column', height: process.stdout.rows || 40 },
    header,
    view === 'list'
      ? h(JobList, {
          jobs,
          cursor,
          tab,
          onCursorChange: setCursor,
          onSelect: handleSelect,
          onMark: handleMark,
          onAISummary: handleAISummary,
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
    view === 'ai'
      ? h(AIPanel, {
          text: ai.text,
          loading: ai.loading,
          error: ai.error,
          onDismiss: () => {
            ai.clear();
            setView(selectedJob ? 'detail' : 'list');
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
