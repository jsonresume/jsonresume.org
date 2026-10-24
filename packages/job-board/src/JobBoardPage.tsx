import { RegistryProvider } from '@effect/atom-react';
import { Button, Container, Hero, Section, Text } from '@jsonresume/ui';
import type { JobBoard } from '@repo/api';
import { hnUrl } from './format';
import { JobCard } from './JobCard';
import { JobFilterBar, useFilteredJobs } from './JobFilters';
import { JobList } from './JobList';

export interface JobLinks {
  /** A job's page. */
  job: (id: number) => string;
  /** Jobs ranked against your resume (signs in first if needed). */
  matches: string;
}

function Board({ board, links }: { board: JobBoard; links: JobLinks }) {
  const jobs = useFilteredJobs(board.jobs);
  return (
    <>
      <JobFilterBar resultCount={jobs.length} />
      <JobList
        jobs={jobs}
        renderJob={(job) => <JobCard job={job} href={links.job(job.id)} />}
      />
    </>
  );
}

/** /jobs: every open role from Hacker News, searchable. */
export function JobBoardPage({
  board,
  links,
}: {
  board: JobBoard;
  links: JobLinks;
}) {
  return (
    <>
      <Hero
        size="compact"
        align="start"
        eyebrow="Jobs"
        title={`${board.jobs.length} open roles from Hacker News`}
        lede={
          <>
            Every post in{' '}
            {board.thread ? (
              <a href={hnUrl(board.thread.id)}>
                {board.thread.title.replace(/^Ask HN: /, '')}
              </a>
            ) : (
              '“Who is hiring?”'
            )}{' '}
            and the month before, read and tidied each day. A role reposted
            month after month shows once.
          </>
        }
        actions={
          <Button asChild variant="primary">
            <a href={links.matches}>Rank them against my resume</a>
          </Button>
        }
      />
      <Section spacing="lg">
        <Container size="wide">
          {/* Filter atoms load Effect's runtime on this page only. */}
          <RegistryProvider>
            <Board board={board} links={links} />
          </RegistryProvider>
          <Text tone="muted" size="sm">
            Posts belong to their authors on Hacker News; apply the way each
            post asks.
          </Text>
        </Container>
      </Section>
    </>
  );
}
