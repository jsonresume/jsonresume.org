import { useAtomValue } from '@effect/atom-react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CopyButton,
  TaskList,
  type Task,
} from '@jsonresume/ui';
import { accountAtom, currentResumeAtom } from '@repo/api-client';
import { AsyncResult } from 'effect/reactivity';

const record = (value: unknown): Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
const filled = (value: unknown) => Array.isArray(value) && value.length > 0;

/** A name and something about them: more than the empty starter. */
export const hasContent = (resume: unknown) => {
  const r = record(resume);
  const name = record(r['basics'])['name'];
  return (
    typeof name === 'string' &&
    name.trim() !== '' &&
    (filled(r['work']) || filled(r['skills']) || filled(r['education']))
  );
};

export const themeOf = (resume: unknown) => {
  const theme = record(record(resume)['meta'])['theme'];
  return typeof theme === 'string' && theme.trim() !== '' ? theme : null;
};

const go = (href: string, label: string) => (
  <Button asChild size="sm" variant="secondary">
    <a href={href}>{label}</a>
  </Button>
);

/**
 * Shown until the first view: what is left before the page is worth
 * sharing, worked out from the account and the resume it serves.
 */
export function GetStarted({ url }: { url: string }) {
  const account = useAtomValue(accountAtom);
  const current = useAtomValue(currentResumeAtom);
  if (!AsyncResult.isSuccess(account) || !AsyncResult.isSuccess(current))
    return null;
  const { emailVerified, github } = account.value;
  const { resume } = current.value;
  const tasks: Task[] = [
    {
      id: 'confirm',
      title: 'Confirm your email',
      description: 'Your page goes live once you follow the link we sent.',
      done: emailVerified || github !== null,
    },
    {
      id: 'write',
      title: 'Write your resume',
      description: 'Your work, skills and education, or import a resume.json.',
      done: hasContent(resume),
      action: go('/dashboard/editor', 'Open the editor'),
    },
    {
      id: 'theme',
      title: 'Choose a theme',
      description: 'Your page and its PDF use it. Pick one in the editor.',
      done: themeOf(resume) !== null,
      action: go('/dashboard/editor', 'Choose a theme'),
    },
    {
      id: 'github',
      title: 'Link GitHub',
      description: 'Keep resume.json in a gist and your page follows it.',
      done: github !== null,
      optional: true,
      action: go('/dashboard/resume', 'Link GitHub'),
    },
    {
      id: 'share',
      title: 'Share your link',
      description: 'Views show up here within seconds of someone reading it.',
      done: false,
      action: <CopyButton value={url} label="Copy your link" />,
    },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle level={2}>Get your page ready</CardTitle>
        <CardDescription>
          A few steps, then this page fills with who reads your resume.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TaskList tasks={tasks} label="Set up your page" progress />
      </CardContent>
    </Card>
  );
}
