import { globalStyle, style } from '@vanilla-extract/css';

/*
 * The header carries both: Sign in and Sign up, and Dashboard. Which one
 * shows is decided before the first paint by authHintScript, from the
 * hint cookie, so a signed-in visitor never sees the other flash by.
 */
export const signedOut = style({ display: 'contents' });
export const signedIn = style({ display: 'none' });

globalStyle(`:root[data-auth="in"] ${signedOut}`, { display: 'none' });
globalStyle(`:root[data-auth="in"] ${signedIn}`, { display: 'contents' });
