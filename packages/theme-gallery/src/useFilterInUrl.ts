import { useAtom } from '@effect/atom-react';
import { useEffect, useRef } from 'react';
import { themeQueryAtom, themeTagAtom } from './atoms';

/**
 * Keep the gallery filter in the URL (?q=...&tag=...) so searches can be
 * shared. The URL is read after the first render, not during it: prerendered
 * HTML shows every theme, and the first client render must match it.
 */
export function useFilterInUrl() {
  const [query, setQuery] = useAtom(themeQueryAtom);
  const [tag, setTag] = useAtom(themeTagAtom);
  const loaded = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get('q') ?? '');
    setTag(params.get('tag') || null);
    loaded.current = true;
  }, [setQuery, setTag]);

  useEffect(() => {
    if (!loaded.current) return;
    const url = new URL(window.location.href);
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    if (tag) url.searchParams.set('tag', tag);
    else url.searchParams.delete('tag');
    if (url.href !== window.location.href) {
      window.history.replaceState(window.history.state, '', url);
    }
  }, [query, tag]);
}
