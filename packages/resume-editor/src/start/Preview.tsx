import { useAtom, useAtomSet, useAtomValue } from '@effect/atom-react';
import {
  Button,
  ChipGroup,
  Heading,
  PreviewFrame,
  Text,
  useSettledValue,
} from '@jsonresume/ui';
import { THEME_METADATA } from '@jsonresume/theme-metadata';
import { useSignedInHint } from '@repo/api-client';
import { AsyncResult } from 'effect/reactivity';
import { useRef } from 'react';
import { useWide } from '../backup';
import { writeStartDraft } from './draft';
import { tidy } from './guided';
import * as s from './start.css';
import {
  START_THEMES,
  startImportAtom,
  startPreviewAtom,
  startResumeAtom,
  startStepAtom,
  startThemeAtom,
  withTheme,
} from './state';

/** Where the editor picks the draft up and saves it. */
export const EDITOR_FROM_START = '/dashboard/editor?start=1';

/** The recommended themes, and the one chosen from the gallery if another. */
const optionsWith = (theme: string) =>
  (START_THEMES.includes(theme) ? START_THEMES : [theme, ...START_THEMES]).map(
    (slug) => ({ value: slug, label: THEME_METADATA[slug]?.name ?? slug })
  );

/**
 * The resume in a recommended theme, then the one moment an account is
 * asked for: to save it and get a link.
 */
export function Preview() {
  const resume = useAtomValue(startResumeAtom);
  const imported = useAtomValue(startImportAtom);
  const setStep = useAtomSet(startStepAtom);
  const [theme, setTheme] = useAtom(startThemeAtom);
  const signedIn = useSignedInHint();
  // A page scaled to a phone's width is short: no tall empty frame below it.
  const wide = useWide('(min-width: 48rem)');
  const clean = tidy(resume);
  const key = useSettledValue(JSON.stringify({ resume: clean, theme }), 300);
  const result = useAtomValue(startPreviewAtom(key));
  const last = useRef('');
  if (AsyncResult.isSuccess(result)) last.current = result.value;
  const busy = !AsyncResult.isSuccess(result) || AsyncResult.isWaiting(result);
  const next = signedIn
    ? EDITOR_FROM_START
    : `/signup?next=${encodeURIComponent(EDITOR_FROM_START)}`;

  return (
    <>
      <Heading level={2} size="subsection">
        Pick a look
      </Heading>
      <ChipGroup
        label="Theme"
        options={optionsWith(theme)}
        value={theme}
        onValueChange={(slug) => slug && setTheme(slug)}
      />
      <div className={s.previewLayout}>
        <PreviewFrame
          title={`Your resume in the ${theme} theme`}
          srcDoc={last.current}
          height={wide ? 720 : 440}
          busy={busy}
        />
        <div className={s.aside}>
          <Text size="sm" tone="muted">
            These themes read cleanly in applicant-tracking systems and print
            well. You can switch to any of the others later.
          </Text>
          <Button asChild variant="primary" size="lg">
            <a
              href={next}
              onClick={() => writeStartDraft(withTheme(clean, theme))}
            >
              {signedIn ? 'Save it' : 'Save it and get your link'}
            </a>
          </Button>
          <Text size="sm" tone="muted">
            Free. Your page lives at jsonresume.org/@you, with PDF and Word
            downloads.
          </Text>
          <Button
            variant="secondary"
            onClick={() => setStep(imported ? 'review' : 'guided')}
          >
            Back to editing
          </Button>
        </div>
      </div>
    </>
  );
}
