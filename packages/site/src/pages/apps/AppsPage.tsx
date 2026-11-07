import { RegistryProvider, useAtomValue } from '@effect/atom-react';
import {
  Card,
  Container,
  EmptyState,
  Hero,
  Section,
  Skeleton,
  Text,
} from '@jsonresume/ui';
import { appsDirectoryAtom } from '@repo/api-client';
import { AsyncResult } from 'effect/reactivity';
import { paths } from '../../links';
import * as s from './apps.css';

const people = (n: number) =>
  n === 0
    ? 'New'
    : `${n.toLocaleString('en')} ${n === 1 ? 'person' : 'people'}`;

function Directory() {
  const result = useAtomValue(appsDirectoryAtom);
  if (!AsyncResult.isSuccess(result))
    return AsyncResult.isFailure(result) ? (
      <EmptyState title="The directory didn’t load">
        Try again in a minute.
      </EmptyState>
    ) : (
      <Skeleton height="12rem" />
    );
  if (result.value.length === 0)
    return (
      <EmptyState title="No apps listed yet">
        Built something on JSON Resume accounts? List it from Settings → Your
        OAuth apps. <a href={paths.developers}>How to build one</a>.
      </EmptyState>
    );
  return (
    <ul className={s.list} aria-label="Apps">
      {result.value.map((app) => (
        <li key={app.id}>
          <Card asChild interactive tone="raised">
            <a className={s.app} href={app.homepage} rel="noopener">
              <span className={s.name}>{app.name}</span>
              <span className={s.description}>{app.description}</span>
              <Text as="span" size="xs" tone="muted">
                {people(app.users)} connected · {new URL(app.homepage).hostname}
              </Text>
            </a>
          </Card>
        </li>
      ))}
    </ul>
  );
}

/** /apps: apps people can connect their JSON Resume to, listed by their makers. */
export function AppsPage() {
  return (
    <>
      <Hero
        size="compact"
        align="start"
        eyebrow="Apps"
        title="Apps that work with your resume"
        lede="Each connects with “Sign in with JSON Resume”: you choose what it may read or change, and can disconnect it any time in Settings."
      />
      <Section spacing="lg">
        <Container>
          <RegistryProvider>
            <Directory />
          </RegistryProvider>
          <p className={s.more}>
            Building one?{' '}
            <a href={paths.developers}>Sign in with JSON Resume</a> explains
            how, and listing it here is a switch in Settings.
          </p>
        </Container>
      </Section>
    </>
  );
}
