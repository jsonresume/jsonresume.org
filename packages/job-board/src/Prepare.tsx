import { Button, Card, Heading, Text } from '@jsonresume/ui';
import type { Job } from '@repo/api';
import { companyText } from './format';
import * as s from './job.css';

/** Questions for Pathways' copilot about this job, as links to ask them. */
export function Prepare({
  job,
  ask,
}: {
  job: Job;
  ask: (q: string) => string;
}) {
  const role = `the ${job.title} job at ${companyText(job.company)} (job ${
    job.id
  })`;
  const questions = [
    [
      'Tailor my resume to it',
      `Tailor my resume to ${role}. Show me each change before saving.`,
    ],
    [
      'Write a cover letter',
      `Write a cover letter for ${role}, from my resume.`,
    ],
    [
      'Practise the interview',
      `Give me a mock interview for ${role}, one question at a time, with feedback.`,
    ],
  ] as const;
  return (
    <Card tone="raised" className={s.prepare}>
      <Heading level={2} size="group">
        Get ready with Pathways
      </Heading>
      <Text size="sm" tone="muted">
        Our career copilot reads your resume and this post.
      </Text>
      {questions.map(([label, question]) => (
        <Button key={label} asChild variant="secondary" size="sm">
          <a href={ask(question)} rel="nofollow">
            {label}
          </a>
        </Button>
      ))}
    </Card>
  );
}
