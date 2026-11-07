/**
 * Where an ATS issue's field is in the form: "work[].highlights" is the
 * Work section, and the first entry's highlights (work.0.highlights).
 */
export const fieldTarget = (field: string) => {
  const path = field.replace(/\[\]/g, '.0').replace(/\[(\d+)\]/g, '.$1');
  return { section: path.split('.')[0] ?? path, path };
};

/**
 * Scroll the field into view and focus its first control; when the form
 * has no element for it (an empty list), the nearest one that holds it.
 */
export const reveal = (path: string, root: Document | Element = document) => {
  const parts = path.split('.');
  for (let n = parts.length; n > 0; n--) {
    const key = parts.slice(0, n).join('.');
    const found = root.querySelector(`[data-path="${CSS.escape(key)}"]`);
    if (found instanceof HTMLElement) {
      found.scrollIntoView?.({ block: 'center' });
      const control = found.querySelector<HTMLElement>(
        'input, textarea, select, button'
      );
      control?.focus({ preventScroll: true });
      return key;
    }
  }
  return undefined;
};
