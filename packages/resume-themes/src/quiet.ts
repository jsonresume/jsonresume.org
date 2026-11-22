import sink from 'node:console';

const METHODS = ['log', 'info', 'debug', 'warn', 'error', 'trace'] as const;

/**
 * Runs a theme's render with the console silenced. Some themes print as
 * they render (rickosborne logs every section), and anything a theme
 * prints lands in the server's logs, where a resume's text has no place.
 * Themes render synchronously, so nothing else runs while it is muted; a
 * theme that returns a Promise is muted only until its first await.
 */
export const quietly = <A>(run: () => A): A => {
  const saved = METHODS.map((method) => [method, sink[method]] as const);
  for (const method of METHODS) sink[method] = () => undefined;
  try {
    return run();
  } finally {
    for (const [method, original] of saved) sink[method] = original;
  }
};
