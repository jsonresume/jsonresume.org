import { useAtom, useAtomSet, useAtomValue } from '@effect/atom-react';
import schemaJson from '@jsonresume/schema/schema.json';
import { AppPage, Callout, Skeleton, SplitView, Stack } from '@jsonresume/ui';
import { media } from '@jsonresume/ui/tokens';
import { decodeJsonSchema } from '@repo/schema-explorer';
import { optionParam, useAtomsInUrl } from '@repo/url-state';
import { useMemo, useState } from 'react';
import { clearBackup, readBackup, useWide } from './backup';
import { pathKey } from './form/context';
import { FormProvider } from './form/FormProvider';
import { ResumeForm } from './form/ResumeForm';
import { JsonPane } from './JsonPane';
import { formSections } from './model';
import { PreviewPane } from './PreviewPane';
import { AllowGist, Start } from './Start';
import { CheckPane } from './CheckPane';
import { SidePane } from './SidePane';
import {
  draftAtom,
  jsonTextAtom,
  modeParamAtom,
  panelParamAtom,
  serialize,
} from './state';
import { EditorActions, SaveBar } from './Actions';
import { CompactToolbar, EditorToolbar, type Mode, type View } from './Toolbar';
import { useEditorSession } from './useEditorSession';
import { validate } from './validate';

const schema = decodeJsonSchema(schemaJson);
const sections = formSections(schema);
const bindings = [
  optionParam('mode', modeParamAtom),
  optionParam('panel', panelParamAtom),
];

/** Edit the resume as a form or as JSON, with the page beside it, live. */
export function ResumeEditor({ username }: { username: string }) {
  useAtomsInUrl(bindings);
  const draft = useAtomValue(draftAtom);
  const setText = useAtomSet(jsonTextAtom);
  const [modeParam, setModeParam] = useAtom(modeParamAtom);
  const mode: Mode = modeParam === 'json' ? 'json' : 'form';
  const [panel, setPanel] = useAtom(panelParamAtom);
  const [phoneView, setView] = useState<'edit' | 'preview'>('edit');
  // ?panel=check (the registry's ATS page, the dashboard's link) opens on it.
  const view: View = panel === 'check' ? 'check' : phoneView;
  const onView = (next: View) => {
    setPanel(next === 'check' ? 'check' : null);
    if (next !== 'check') setView(next);
  };
  const [backup, setBackup] = useState(() => readBackup(username));
  const wide = useWide(media.lg);
  const {
    ready,
    loadedResume,
    target,
    saving,
    notice,
    onSave,
    replace: start,
  } = useEditorSession(username);

  const issues = useMemo(
    () => (draft === null ? [] : validate(draft, schema)),
    [draft]
  );
  const issueMap = useMemo(
    () => new Map(issues.map((i) => [pathKey(i.path), i.message])),
    [issues]
  );
  // A gist that feeds the page stays the source of truth: saves go there.
  const toGist = target.source === 'gist' && target.github !== null;
  const onMode = (next: Mode) => {
    if (next === 'json') setText(serialize(draft));
    setModeParam(next === 'json' ? 'json' : null);
  };

  if (!ready) {
    return (
      <AppPage title="Editor">
        <Skeleton height="24rem" />
      </AppPage>
    );
  }

  const editor =
    mode === 'json' ? (
      <JsonPane schema={schema} />
    ) : (
      <FormProvider issues={issueMap}>
        <ResumeForm sections={sections} issues={issueMap} />
      </FormProvider>
    );
  const restorable =
    backup &&
    serialize(backup.resume) !== serialize(draft) &&
    serialize(backup.resume) !== serialize(loadedResume);

  const save = {
    saving,
    saveLabel: toGist ? 'Save to gist' : 'Save',
    blocked: toGist && !target.gistWrite,
    onSave: () => void onSave(),
  };

  return (
    <AppPage
      title="Editor"
      fill
      description={
        toGist
          ? `The preview follows as you type; Save writes to your gist (@${target.github}), which /@${username} reads.`
          : `The preview follows as you type; Save puts it on /@${username}.`
      }
      actions={
        <EditorActions path={`/@${username}`} withSave={wide} {...save} />
      }
      toolbar={
        wide ? (
          <EditorToolbar mode={mode} onMode={onMode} problems={issues.length} />
        ) : (
          <CompactToolbar
            mode={mode}
            view={view}
            onMode={onMode}
            onView={onView}
            problems={issues.length}
          />
        )
      }
    >
      <Stack gap={4}>
        {toGist && !target.gistWrite ? <AllowGist /> : null}
        {notice ? <Callout tone={notice.tone}>{notice.text}</Callout> : null}
        {restorable ? (
          <Callout tone="warning" title="You have unsaved changes from before">
            <Start.Restore
              at={backup.at}
              onRestore={() => {
                start(backup.resume);
                setBackup(undefined);
              }}
              onDiscard={() => {
                clearBackup(username);
                setBackup(undefined);
              }}
            />
          </Callout>
        ) : null}
      </Stack>
      {draft === null ? (
        <div>
          <Start onStart={start} />
        </div>
      ) : wide ? (
        <SplitView
          defaultSizes={[50, 50]}
          minSize={30}
          paneLabels={['Editor', 'Preview']}
        >
          {editor}
          <SidePane />
        </SplitView>
      ) : view === 'edit' ? (
        editor
      ) : view === 'check' ? (
        <CheckPane />
      ) : (
        <PreviewPane />
      )}
      {wide || draft === null ? null : <SaveBar {...save} />}
    </AppPage>
  );
}
