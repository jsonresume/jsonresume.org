/** Cookie names, importable without Effect (the site header reads the hint). */
export const SESSION_COOKIE = 'jr_session';

/**
 * Readable by page scripts and holding nothing secret: it only tells pages
 * (prerendered, so they can't know) to show "Dashboard" instead of "Sign in".
 */
export const SIGNED_IN_HINT = 'jr_signed_in';
