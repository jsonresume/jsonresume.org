import { RegistryProvider, useAtomSet, useAtomValue } from '@effect/atom-react';
import { THEME_METADATA } from '@jsonresume/theme-metadata';
import { useEffect } from 'react';
import { Container, Heading, Text } from '@jsonresume/ui';
import { Choose } from './Choose';
import { Guided } from './Guided';
import { Preview } from './Preview';
import { Review } from './Review';
import * as s from './start.css';
import { startStepAtom, startThemeAtom } from './state';

function Step() {
  const step = useAtomValue(startStepAtom);
  const setTheme = useAtomSet(startThemeAtom);
  // ?theme= from a theme's "start one in this theme" link.
  useEffect(() => {
    const slug = new URL(window.location.href).searchParams.get('theme');
    if (slug && Object.hasOwn(THEME_METADATA, slug)) setTheme(slug);
  }, [setTheme]);
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
