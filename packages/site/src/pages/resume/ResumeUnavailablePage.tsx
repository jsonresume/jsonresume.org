import {
  Button,
  CodeBlock,
  Container,
  PageHeader,
  Section,
  SectionIntro,
  Step,
  Steps,
} from '@jsonresume/ui';
import { gettingStarted, resumeHosting } from '@repo/content/pages';
import type { ResumeProblem } from '@repo/domain';
import { InlineMarkdown } from '../../InlineMarkdown';
import { paths, resumeUrl as resumePath } from '../../links';
import { SiteLink } from '../../SiteLink';
import * as s from './resume.css';

/** How to publish, for someone who arrived at an empty /@name. */
function Publish({ username }: { username: string }) {
  const [write, gist] = gettingStarted.gistSteps;
  return (
    <Section spacing="lg">
      <Container size="prose">
        <SectionIntro overline="Is this you?" title="Publish your resume">
          Three steps, all free. The page updates whenever you edit the gist.
        </SectionIntro>
        <Steps layout="vertical">
          {[write, gist].map((step) =>
            step ? (
              <Step key={step.title} title={step.title}>
                <InlineMarkdown>{step.body}</InlineMarkdown>
              </Step>
            ) : null
          )}
          <Step title="Open your page">
            Your resume appears at <code>{resumePath(username)}</code>, in any
            theme and as JSON, YAML or plain text.
          </Step>
        </Steps>
      </Container>
    </Section>
  );
}

function Actions({ problem }: { problem: ResumeProblem }) {
  const { username } = problem;
  switch (problem.kind) {
    case 'no-user':
    case 'no-gist':
      return (
        <Button asChild variant="primary">
          <a href="https://gist.github.com">Create a gist</a>
        </Button>
      );
    case 'unpublished':
      return (
        <Button asChild variant="primary">
          <SiteLink href={paths.signIn}>Is this you? Sign in</SiteLink>
        </Button>
      );
    case 'github-down':
      return (
        <Button asChild variant="primary">
          <a href={resumePath(username)}>Try again</a>
        </Button>
      );
    case 'theme-missing':
    case 'theme-failed':
      return (
        <>
          <Button asChild variant="primary">
            <a href={resumePath(username)}>Open in the default theme</a>
          </Button>
          <Button asChild variant="secondary">
            <SiteLink href={paths.themes}>Browse themes</SiteLink>
          </Button>
        </>
      );
    case 'unknown-format':
      return (
        <>
          <Button asChild variant="primary">
            <a href={resumePath(username)}>Open the page</a>
          </Button>
          {resumeHosting.formats.map((f) => (
            <Button key={f.extension} asChild variant="secondary">
              <a href={resumePath(username, f.extension)}>{f.label}</a>
            </Button>
          ))}
        </>
      );
    case 'not-json':
    case 'not-object':
      return (
        <Button asChild variant="secondary">
          <SiteLink href={paths.schema}>See the schema</SiteLink>
        </Button>
      );
  }
}

/** /@username when there is no resume to show: what happened, what to do. */
export function ResumeUnavailablePage({ problem }: { problem: ResumeProblem }) {
  const copy = resumeHosting.problems[problem.kind](problem);
  const detail =
    problem.kind === 'not-json' || problem.kind === 'not-object'
      ? problem.message
      : undefined;
  return (
    <>
      <meta name="robots" content="noindex" />
      <PageHeader
        eyebrow={`@${problem.username}`}
        title={copy.title}
        description={<InlineMarkdown>{copy.body}</InlineMarkdown>}
        actions={<Actions problem={problem} />}
      />
      {detail ? (
        <Section spacing="md">
          <Container size="prose">
            <CodeBlock code={detail} />
          </Container>
        </Section>
      ) : null}
      {problem.kind === 'no-gist' ? (
        <Publish username={problem.username} />
      ) : null}
      {problem.kind === 'theme-failed' ? (
        <Section spacing="md">
          <Container size="prose">
            <a href={resumeHosting.reportIssue}>
              Report the theme problem on GitHub
            </a>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
