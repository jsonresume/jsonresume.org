import { useAtom, useAtomSet, useAtomValue } from '@effect/atom-react';
import { useShortcut } from '@jsonresume/ui';
import { errorTag, keys, saveResumeAtom } from '@repo/api-client';
import { AsyncResult } from 'effect/reactivity';
import { useEffect, useState } from 'react';
import { clearBackup, useBackup } from './backup';
import {
  dirtyAtom,
  draftAtom,
  editorResumeAtom,
  jsonTextAtom,
  savedAtom,
  serialize,
} from './state';

export interface Notice {
  tone: 'success' | 'danger' | 'info';
  text: string;
}

/**
 * The editor's life: the first load becomes the draft, unsaved edits are
 * backed up in the browser and guarded on leaving, and Save (or ⌘/Ctrl+S)
 * stores the draft as the copy the page shows.
 */
export function useEditorSession(username: string) {
  const loaded = useAtomValue(editorResumeAtom);
  const [draft, setDraft] = useAtom(draftAtom);
  const setSaved = useAtomSet(savedAtom);
  const setText = useAtomSet(jsonTextAtom);
  const dirty = useAtomValue(dirtyAtom);
  const save = useAtomSet(saveResumeAtom, { mode: 'promiseExit' });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice>();
  const ready = AsyncResult.isSuccess(loaded);
  const source = ready ? loaded.value.source : 'stored';

  useEffect(() => {
    if (!AsyncResult.isSuccess(loaded) || draft !== null) return;
    setDraft(loaded.value.resume);
    setSaved(serialize(loaded.value.resume));
    setText(serialize(loaded.value.resume));
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  useBackup(username, draft, dirty);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) =>
      dirty ? e.preventDefault() : undefined;
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const onSave = async () => {
    if (!dirty || saving || !ready) return;
    setSaving(true);
    const exit = await save({
      payload: { resume: draft },
      reactivityKeys: keys.account,
    });
    setSaving(false);
    if (errorTag(exit) !== undefined) {
      return setNotice({
        tone: 'danger',
        text: 'That didn’t save. Check your connection and try again.',
      });
    }
    setSaved(serialize(draft));
    clearBackup(username);
    setNotice(
      source === 'gist'
        ? {
            tone: 'info',
            text: 'Saved. Your page now shows this copy; your gist is unchanged (switch back on the Resume page).',
          }
        : { tone: 'success', text: 'Saved. Your page shows it now.' }
    );
  };
  useShortcut('mod+s', (e) => {
    e.preventDefault();
    void onSave();
  });

  /** Replace the draft (start, restore), keeping the JSON view in step. */
  const replace = (resume: unknown) => {
    setDraft(resume);
    setText(serialize(resume));
  };

  return {
    ready,
    loadedResume: ready ? loaded.value.resume : null,
    saving,
    notice,
    onSave,
    replace,
  };
}
