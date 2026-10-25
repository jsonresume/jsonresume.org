import { parseHandle } from '@repo/profiles';
import { Effect } from 'effect';
import { lookup, redirect, type ResumeOutcome } from './outcome';

/** /@username/timeline: the resume to show as one, or what to answer instead. */
export type TimelineOutcome =
  | ResumeOutcome
  | { _tag: 'Timeline'; username: string; resume: unknown };

const PATH = /^\/(@[^/]+)\/timeline\/?$/i;

/**
 * Serve `/@name/timeline`: the resume behind `/@name`, for the app to show
 * as a timeline; a redirect for capitals or a renamed account; or the
 * problem. Undefined when the path is not a timeline.
 */
export const timelineOutcome = Effect.fn('timelineOutcome')(function* (
  url: URL
) {
  const segment = PATH.exec(url.pathname.replace(/%40/i, '@'))?.[1];
  const handle = segment ? parseHandle(segment) : undefined;
  if (!handle || handle.extension !== 'html') return undefined;
  const path = `/@${handle.username}/timeline`;
  if (!handle.canonical || url.pathname !== path)
    return redirect(path + url.search, 301);
  const resolved = yield* lookup(handle.username, undefined, true);
  if (resolved._tag === 'Moved')
    return redirect(`/@${resolved.username}/timeline`, 301);
  if (resolved._tag !== 'Resume') return resolved;
  const outcome: TimelineOutcome = {
    _tag: 'Timeline',
    username: handle.username,
    resume: resolved.resume,
  };
  return outcome;
});
