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

const saveError = (tag: string) =>
  tag === 'GistPermissionNeeded'
    ? 'GitHub hasn’t let JSON Resume update your gist yet. Allow it above, then save again.'
    : tag === 'GithubUnreachable'
    ? 'GitHub isn’t answering, so your gist wasn’t updated. Try again in a minute.'
    : 'That didn’t save. Check your connection and try again.';

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
    const tag = errorTag(exit);
    if (tag !== undefined)
      return setNotice({ tone: 'danger', text: saveError(tag) });
    setSaved(serialize(draft));
    clearBackup(username);
    setNotice({
      tone: 'success',
      text:
        source === 'gist'
          ? 'Saved to your gist. Your page shows it now.'
          : 'Saved. Your page shows it now.',
    });
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

  /** Where saves go: their gist (and whether GitHub allows it), or the copy here. */
  const target = ready
    ? {
        source: loaded.value.source,
        github: loaded.value.github,
        gistWrite: loaded.value.gistWrite,
      }
    : { source: 'stored' as const, github: null, gistWrite: false };

  return {
    ready,
    loadedResume: ready ? loaded.value.resume : null,
    target,
    saving,
    notice,
    onSave,
    replace,
  };
}
