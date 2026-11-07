import { RegistryProvider, useAtomSet, useAtomValue } from '@effect/atom-react';
import { THEME_METADATA } from '@jsonresume/theme-metadata';
import { useEffect } from 'react';
import { Container, Heading, Text } from '@jsonresume/ui';
import { Choose } from './Choose';
import { Guided } from './Guided';
import { Preview } from './Preview';
import { Review } from './Review';
import * as s from './start.css';
import { startResumeAtom, startStepAtom, startThemeAtom } from './state';

const examples = () => import('@repo/content/documents');

function Step() {
  const step = useAtomValue(startStepAtom);
  const setTheme = useAtomSet(startThemeAtom);
  const setResume = useAtomSet(startResumeAtom);
  const setStep = useAtomSet(startStepAtom);
  // ?theme= from a theme's "start one in this theme" link, and ?example=
  // from an example resume's "start with this example".
  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    const slug = params.get('theme');
    if (slug && Object.hasOwn(THEME_METADATA, slug)) setTheme(slug);
    const example = params.get('example');
    if (!example) return;
    let live = true;
    void examples()
      .then((m) => m.loadExample(example))
      .then((found) => {
        if (!live || !found) return;
        setResume(found.resume);
        setStep('preview');
      });
    return () => {
      live = false;
    };
  }, [setTheme, setResume, setStep]);
  return step === 'review' ? (
    <Review />
  ) : step === 'guided' ? (
    <Guided />
  ) : step === 'preview' ? (
    <Preview />
  ) : (
    <Choose />
  );
}

/**
 * /start: a resume without an account. Import or write it, check it, see
 * it in a theme, and sign up only to save it.
 */
export function StartPage() {
  return (
    <RegistryProvider>
      <Container>
        <div className={s.page}>
          <div className={s.intro}>
            <Heading level={1} size="title">
              Make your resume
            </Heading>
            <Text tone="muted">
              Bring the one you have, or answer a few questions. It takes about
              five minutes.
            </Text>
          </div>
          <Step />
        </div>
      </Container>
    </RegistryProvider>
  );
}
