import { useAtomValue } from '@effect/atom-react';
import { PreviewFrame, useSettledValue } from '@jsonresume/ui';
import { AsyncResult } from 'effect/reactivity';
import { useRef } from 'react';
import { draftAtom, previewAtom, previewKey, themeOf } from './state';

/**
 * The page as it will look, in its theme, half a second after typing
 * stops. The last render stays (dimmed) while the next one arrives, and the
 * theme's HTML runs sandboxed: no scripts, no access to this site.
 */
export function PreviewPane() {
  const draft = useAtomValue(draftAtom);
  const theme = themeOf(draft);
  const key = useSettledValue(previewKey(draft, theme), 500);
  const result = useAtomValue(previewAtom(key));
  const last = useRef('');
  if (AsyncResult.isSuccess(result)) last.current = result.value;
  const busy = !AsyncResult.isSuccess(result) || AsyncResult.isWaiting(result);
  return (
    <PreviewFrame
      title={`Preview, ${theme} theme`}
      srcDoc={last.current}
      height="fill"
      busy={busy}
    />
  );
}
