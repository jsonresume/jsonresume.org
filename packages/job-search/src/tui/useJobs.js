import { useState, useEffect, useCallback, useMemo } from 'react';
import { getCached, setCache, updateCachedJob } from '../cache.js';

export function useJobs(api, activeFilters, tab, searchId) {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setLoading(true);
      setError(null);

      if (!force) {
        const cached = getCached(params);
        if (cached) {
          setAllJobs(cached);
          setLoading(false);
          return;
        }
      }

      try {
        const { jobs: data } = await api.fetchJobs(params);
        const result = data || [];
        setCache(params, result);
        setAllJobs(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [api, paramsKey]
  );

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
    return filtered;
  }, [allJobs, activeFilters, tab]);

  const markJob = useCallback(
    async (id, state, feedback) => {
      setAllJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, state } : j))
      );
      updateCachedJob(params, id, { state });
      try {
        await api.markJob(id, state, feedback);
      } catch {
        fetchJobs(false);
      }
    },
    [api, fetchJobs, paramsKey]
  );

  const forceRefresh = useCallback(() => fetchJobs(true), [fetchJobs]);

  return { jobs, allJobs, loading, error, markJob, forceRefresh };
}
