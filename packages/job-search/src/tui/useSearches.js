import { useState, useEffect, useCallback } from 'react';

export function useSearches(api) {
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { searches: data } = await api.listSearches();
      setSearches(data || []);
    } catch {
      // Silently fail — searches are optional
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const create = useCallback(
    async (name, prompt) => {
      try {
        const { search } = await api.createSearch(name, prompt);
        setSearches((prev) => [search, ...prev]);
        return search;
      } catch (err) {
        throw err;
      }
    },
    [api]
  );

  const remove = useCallback(
    async (id) => {
      try {
        await api.deleteSearch(id);
        setSearches((prev) => prev.filter((s) => s.id !== id));
      } catch {}
    },
    [api]
  );

  const updateFilters = useCallback(
    async (id, filters) => {
      try {
        await api.updateSearch(id, { filters });
      } catch {}
    },
    [api]
  );

  return { searches, loading, create, remove, updateFilters, refetch: fetch };
}
