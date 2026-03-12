import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { getCached, setCache, updateCachedJob } from '../cache.js';

export function useJobs(api, activeFilters, tab, searchId) {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reranking, setReranking] = useState(false);
  const [error, setError] = useState(null);
  const rerankAbort = useRef(null);

  // Build API params from active filters array
  const params = useMemo(() => {
    const p = { top: 100, days: 30 };
    if (searchId) p.searchId = searchId;
    for (const f of activeFilters || []) {
      if (f.type === 'days') p.days = Number(f.value) || 30;
      if (f.type === 'remote') p.remote = true;
      if (f.type === 'minSalary') p.minSalary = Number(f.value) || 0;
      if (f.type === 'search') p.search = f.value || '';
    }
    return p;
  }, [activeFilters, searchId]);

  const paramsKey = JSON.stringify(params);

  const fetchJobs = useCallback(
    async (force) => {
      // Cancel any pending rerank
      if (rerankAbort.current) {
        rerankAbort.current.cancelled = true;
        rerankAbort.current = null;
      }

      setLoading(true);
      setReranking(false);
      setError(null);

      if (!force) {
        // Check for reranked cache first, then plain cache
        const cachedReranked = getCached({ ...params, rerank: true });
        if (cachedReranked) {
          setAllJobs(cachedReranked);
          setLoading(false);
          return;
        }
        const cached = getCached(params);
        if (cached) {
          setAllJobs(cached);
          setLoading(false);
          // Still kick off rerank in background if eligible
          if (searchId) {
            startRerank(cached);
          }
          return;
        }
      }

      try {
        // Pass 1: fast fetch without reranking
        const { jobs: data } = await api.fetchJobs({
          ...params,
          rerank: false,
        });
        const result = data || [];
        setCache(params, result);
        setAllJobs(result);
        setLoading(false);

        // Pass 2: rerank in background if using a custom search
        if (searchId && result.length > 0) {
          startRerank(result);
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    },
    [api, paramsKey]
  );

  function startRerank(currentJobs) {
    const token = { cancelled: false };
    rerankAbort.current = token;
    setReranking(true);

    api
      .fetchJobs({ ...params, rerank: true })
      .then(({ jobs: reranked }) => {
        if (token.cancelled) return;
        const result = reranked || [];
        setCache({ ...params, rerank: true }, result);
        // Merge rerank data into existing jobs (preserve any local state changes)
        setAllJobs((prev) => {
          const stateMap = {};
          prev.forEach((j) => {
            if (j.state) stateMap[j.id] = j.state;
          });
          return result.map((j) => ({
            ...j,
            state: stateMap[j.id] || j.state,
          }));
        });
      })
      .catch(() => {})
      .finally(() => {
        if (!token.cancelled) setReranking(false);
      });
  }

  useEffect(() => {
    fetchJobs(false);
  }, [fetchJobs]);

  // Filter by tab (job state) + client-side filters
  const jobs = useMemo(() => {
    let filtered = allJobs;

    for (const f of activeFilters || []) {
      if (f.type === 'remote') {
        filtered = filtered.filter(
          (j) => j.remote === 'Full' || /remote/i.test(j.location || '')
        );
      }
      if (f.type === 'minSalary' && f.value) {
        filtered = filtered.filter(
          (j) => !j.salary_usd || j.salary_usd >= Number(f.value) * 1000
        );
      }
      if (f.type === 'search' && f.value) {
        const q = f.value.toLowerCase();
        filtered = filtered.filter((j) =>
          JSON.stringify(j).toLowerCase().includes(q)
        );
      }
    }

    if (tab === 'interested')
      return filtered.filter((j) => j.state === 'interested');
    if (tab === 'applied') return filtered.filter((j) => j.state === 'applied');
    if (tab === 'maybe') return filtered.filter((j) => j.state === 'maybe');
    if (tab === 'passed')
      return filtered.filter((j) => j.state === 'not_interested');
    // "All" tab: hide passed and dismissed jobs
    return filtered.filter(
      (j) => j.state !== 'not_interested' && j.state !== 'dismissed'
    );
  }, [allJobs, activeFilters, tab]);

  const markJob = useCallback(
    async (id, state, feedback) => {
      setAllJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, state } : j))
      );
      updateCachedJob(params, id, { state });
      updateCachedJob({ ...params, rerank: true }, id, { state });
      try {
        await api.markJob(id, state, feedback);
      } catch {
        fetchJobs(false);
      }
    },
    [api, fetchJobs, paramsKey]
  );

  const forceRefresh = useCallback(() => fetchJobs(true), [fetchJobs]);

  return { jobs, allJobs, loading, reranking, error, markJob, forceRefresh };
}
