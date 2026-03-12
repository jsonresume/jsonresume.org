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
import { useJobs } from './useJobs.js';
import { useAI } from './useAI.js';
import { useSearches } from './useSearches.js';
import Header from './Header.js';
import JobList from './JobList.js';
import JobDetail from './JobDetail.js';
import FilterManager from './FilterManager.js';
import SearchManager from './SearchManager.js';
import StatusBar from './StatusBar.js';
import AIPanel from './AIPanel.js';

const TABS = ['all', 'interested', 'applied', 'maybe', 'passed'];
const TAB_LABELS = {
  all: 'All Jobs',
  interested: '⭐ Interested',
  applied: '📨 Applied',
  maybe: '? Maybe',
  passed: '✗ Passed',
};

function App({ baseUrl, apiKey }) {
  const { exit } = useApp();
  const api = useMemo(
    () => createApiClient({ baseUrl, apiKey }),
    [baseUrl, apiKey]
  );

  const [view, setView] = useState('list');
  const [tab, setTab] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [cursor, setCursor] = useState(0);
  const [resume, setResume] = useState(null);

  // Active search profile (null = default resume)
  const [activeSearchId, setActiveSearchId] = useState(null);

  // Persistent filters keyed by search profile
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

  // For FilterManager compatibility — it expects { active: [] }
  const filterState = useMemo(
    () => ({ active: activeFilters }),
    [activeFilters]
  );
  const persistFilters = useCallback(
    (s) => updateFilters(s.active),
    [updateFilters]
  );

  const { jobs, allJobs, loading, reranking, error, markJob, forceRefresh } =
    useJobs(api, activeFilters, tab, activeSearchId);
  const ai = useAI(resume);
  const searchesHook = useSearches(api);

  useEffect(() => {
    api
      .fetchMe()
      .then((d) => setResume(d.resume))
      .catch(() => {});
  }, [api]);

  useInput(
    (input, key) => {
      if (view === 'filters' || view === 'searches') return;
      if (input === 'q' && view === 'list') exit();
      if (input === 'R' && view === 'list') forceRefresh();
      if (input === 'f' && view === 'list') setView('filters');
      if (input === '/' && view === 'list') setView('searches');
      if (key.escape && view === 'detail') setView('list');
      if (key.escape && view === 'ai') {
        ai.clear();
        setView(selectedJob ? 'detail' : 'list');
      }
      if (key.tab && view === 'list') {
        const idx = TABS.indexOf(tab);
        setTab(TABS[(idx + 1) % TABS.length]);
        setCursor(0);
      }
      if (key.shift && key.tab && view === 'list') {
        const idx = TABS.indexOf(tab);
        setTab(TABS[(idx - 1 + TABS.length) % TABS.length]);
        setCursor(0);
      }
    },
    { isActive: view !== 'filters' && view !== 'searches' }
  );

  const handleSelect = (job) => {
    setSelectedJob(job);
    setView('detail');
  };
  const handleMark = async (id, state) => {
    await markJob(id, state);
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
  const handleBack = () => {
    setSelectedJob(null);
    setView('list');
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

  return h(
    Box,
    { flexDirection: 'column', height: process.stdout.rows || 40 },
    h(Header, {
      tab,
      tabs: TABS,
      tabLabels: TAB_LABELS,
      counts,
      filters: activeFilters,
      searchName: activeSearch?.name || null,
    }),
    view === 'list'
      ? h(JobList, {
          jobs,
          cursor,
          onCursorChange: setCursor,
          onSelect: handleSelect,
          onMark: handleMark,
          onAISummary: handleAISummary,
          onAIBatch: handleAIBatch,
          isActive: true,
        })
      : null,
    view === 'detail' && selectedJob
      ? h(JobDetail, {
          job: selectedJob,
          api,
          onBack: handleBack,
          onMark: handleMark,
          onAISummary: handleAISummary,
          isActive: true,
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
    h(StatusBar, {
      view,
      jobCount: jobs.length,
      totalCount: allJobs.length,
      loading,
      reranking,
      error,
      aiEnabled: ai.hasKey,
      searchName: activeSearch?.name || null,
    })
  );
}

export default function runTUI({ baseUrl, apiKey }) {
  render(h(App, { baseUrl, apiKey }));
}
