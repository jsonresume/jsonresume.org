/**
 * A prerendered page shows its unfiltered view until React reads the URL,
 * so /themes?style=minimal painted every theme and then collapsed to a
 * few: a layout shift of 0.26 (Web Vitals, 2026-11-25). This pre-paint
 * script marks <html> when the address carries state, so results can wait
 * hidden (see PENDING) until useAtomsInUrl has applied it.
 */
export const urlStateScript = `try{if(location.search.slice(1).split('&').some(function(p){return p&&p.indexOf('utm_')!==0}))document.documentElement.dataset.urlState='pending'}catch(e){}`;

/** The selector that is true while the URL's state is not yet applied. */
export const PENDING = 'html[data-url-state="pending"]';

/** Show what waited, once the filtered render has committed. */
export const urlStateApplied = () => {
  const done = () => {
    delete document.documentElement.dataset['urlState'];
  };
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(done);
  else done();
};
