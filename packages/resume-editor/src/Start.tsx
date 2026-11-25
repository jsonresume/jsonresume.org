import { useAtomValue } from '@effect/atom-react';
import resume from '@jsonresume/sample-data/complete-resume.json';
import { Button, Callout, EmptyState, Stack, Text } from '@jsonresume/ui';
import { accountAtom } from '@repo/api-client';
import { AsyncResult } from 'effect/reactivity';
import { serialize } from './state';

const EXAMPLE = serialize(resume);

/** The example as it came: a preview, never saved as someone's resume. */
export const isUntouchedExample = (draft: unknown) =>
  draft !== null && serialize(draft) === EXAMPLE;

/** Where a resume is read from a file or pasted text (/start), coming back here to save. */
export const IMPORT_PATH = '/start';

/**
 * No resume yet: bring one in (a PDF, Word file, LinkedIn export or pasted
 * text, read on /start and saved here), start blank, or from a complete
 * example to edit. Of new accounts that started blank or from the example,
 * a third left without saving (14 days to 2026-11-18).
 */
export function Start({ onStart }: { onStart: (resume: unknown) => void }) {
  return (
    <EmptyState
      title="Start your resume"
      action={
        <Stack direction="row" wrap gap={3} justify="center">
          <Button asChild variant="primary">
            <a href={IMPORT_PATH}>Import your resume</a>
          </Button>
          <Button
            variant="secondary"
            onClick={() => onStart({ basics: { name: '' } })}
          >
            Start blank
          </Button>
          <Button variant="secondary" onClick={() => onStart(resume)}>
            Start from an example
          </Button>
        </Stack>
      }
    >
      Have one already? Import a PDF, a Word file or your LinkedIn profile and
      check what we read. Or fill the form yourself: every section is optional,
      and the example shows what goes where.
    </EmptyState>
  );
}

/**
 * Straight after signing up (?welcome=1): what this page is for. An email
 * account's page waits for the address to be confirmed, so it says so.
 */
Start.Welcome = function Welcome({ username }: { username: string }) {
  const account = useAtomValue(accountAtom);
  const unconfirmed =
    AsyncResult.isSuccess(account) &&
    account.value.email !== null &&
    !account.value.emailVerified &&
    account.value.github === null;
  return (
    <Callout tone="brand" title="Welcome to JSON Resume">
      {unconfirmed
        ? `Make your resume here. It goes live at jsonresume.org/@${username} once you confirm your email: we sent you a link.`
        : `Make your resume here and it goes live at jsonresume.org/@${username}.`}
    </Callout>
  );
};

/** Bring back a draft kept in this browser, or let it go. */
Start.Restore = function Restore({
  at,
  onRestore,
  onDiscard,
}: {
  at: number;
  onRestore: () => void;
  onDiscard: () => void;
}) {
  return (
    <Stack direction="row" wrap align="center" gap={3}>
      <Text as="span" size="sm">
        From {new Date(at).toLocaleString()}, in this browser.
      </Text>
      <Button size="sm" variant="secondary" onClick={onRestore}>
        Restore them
      </Button>
      <Button size="sm" variant="ghost" onClick={onDiscard}>
        Discard
      </Button>
    </Stack>
  );
};

/** Saving to the gist needs GitHub's gist permission, asked for once. */
export function AllowGist() {
  return (
    <Callout tone="warning" title="Allow saving to your gist">
      <Stack direction="row" wrap align="center" gap={3}>
        <Text as="span" size="sm">
          Your page reads your GitHub gist, so saves go there. GitHub needs to
          let JSON Resume update your gists; it only ever writes resume.json.
        </Text>
        <Button asChild size="sm" variant="secondary">
          <a href="/api/auth/github?intent=link&next=/dashboard/editor">
            Allow on GitHub
          </a>
        </Button>
      </Stack>
    </Callout>
  );
}
