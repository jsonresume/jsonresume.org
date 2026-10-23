import { RegistryContext } from '@effect/atom-react';
import type { Atom } from 'effect/reactivity';
import { useContext, useEffect } from 'react';

/**
 * One search parameter bound to a writable atom holding a string, where
 * `empty` (usually '' or null) means "not in the URL".
 */
export interface UrlBinding {
  param: string;
  atom:
    | Atom.Writable<string | null, string | null>
    | Atom.Writable<string, string>;
  empty: string | null;
}

/** A binding for a text atom, '' when absent. */
export const textParam = (
  param: string,
  atom: Atom.Writable<string, string>
): UrlBinding => ({
  param,
  atom,
  empty: '',
});

/** A binding for an optional value atom, null when absent. */
export const optionParam = (
  param: string,
  atom: Atom.Writable<string | null, string | null>
): UrlBinding => ({ param, atom, empty: null });

const write = (
  binding: UrlBinding,
  value: string | null,
  set: (v: string | null) => void
) => set(value === null && binding.empty === '' ? '' : value);

/**
 * Keep atoms in the URL's search params (e.g. ?q=react&tag=minimal) so a
 * filtered view can be shared. The URL is read after the first render, not
 * during it: prerendered HTML shows the unfiltered page and the first client
 * render must match it. Changes are written with replaceState (no history
 * spam); params the bindings do not own are left alone.
 */
export function useAtomsInUrl(bindings: ReadonlyArray<UrlBinding>): void {
  const registry = useContext(RegistryContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    for (const binding of bindings) {
      const value = params.get(binding.param);
      write(
        binding,
        value === null || value === '' ? binding.empty : value,
        (v) =>
          registry.set(
            binding.atom as Atom.Writable<string | null, string | null>,
            v
          )
      );
    }

    const sync = () => {
      const url = new URL(window.location.href);
      for (const binding of bindings) {
        const value = registry.get(binding.atom);
        if (value === binding.empty || value === '' || value === null) {
          url.searchParams.delete(binding.param);
        } else {
          url.searchParams.set(binding.param, value);
        }
      }
      if (url.href !== window.location.href) {
        window.history.replaceState(window.history.state, '', url);
      }
    };
    const unsubscribes = bindings.map((binding) =>
      registry.subscribe(binding.atom, sync)
    );
    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
    // Bindings are module-level constants; registry identity is stable.
  }, [registry, bindings]);
}
