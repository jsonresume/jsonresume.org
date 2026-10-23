import { Heading, Table, Td, Th } from '@jsonresume/ui';
import type { Metadata } from 'next';
import { DocSection, DocsLayout } from '@/components/docs-layout';
import styles from '@/components/docs.module.css';
import { Guidelines } from '@/components/guidelines';

export const metadata: Metadata = { title: 'Writing' };

const pairs: Array<[string, string, string]> = [
  ['Button', 'Export PDF', 'Click here to export'],
  ['Button', 'Delete resume', 'OK'],
  ['Error', 'Enter an email like name@example.com.', 'Invalid input!'],
  ['Error', 'basics.email must be a string.', 'Validation error 422'],
  [
    'Empty state',
    'No resume found. Create a gist named resume.json.',
    'Nothing here yet!',
  ],
  ['Heading', 'Getting started', 'Getting Started With JSON Resume'],
  ['Link', 'Read the schema', 'Learn more'],
  [
    'Confirmation',
    'Delete your resume? Your gist stays on GitHub.',
    'Are you sure?',
  ],
];

export default function WritingPage() {
  return (
    <DocsLayout>
      <article className={styles.article}>
        <header className={styles.sectionHeader}>
          <Heading level={1} size="title">
            Writing
          </Heading>
          <p className={styles.lede}>
            JSON Resume is written by developers for developers. Be plain,
            specific and brief. Say what something does, what went wrong, and
            what to do next.
          </p>
        </header>

        <DocSection id="examples" title="In practice">
          <Table>
            <thead>
              <tr>
                <Th>Where</Th>
                <Th>Write</Th>
                <Th>Not</Th>
              </tr>
            </thead>
            <tbody>
              {pairs.map(([where, good, bad]) => (
                <tr key={good}>
                  <Td>{where}</Td>
                  <Td>{good}</Td>
                  <Td>
                    <span className={styles.mono}>{bad}</span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </DocSection>

        <DocSection id="style" title="Style">
          <Guidelines
            do={[
              'Sentence case for headings, labels and buttons. Buttons are uppercased by CSS, so write them normally.',
              'Name buttons with a verb and object: "Export PDF".',
              'Write errors that say how to fix the problem.',
              'Use code formatting for field names, commands and file names: resume.json, basics.email.',
              'Write dates as 23 Oct 2026 and versions as 1.7.0.',
            ]}
            dont={[
              'Use exclamation marks, "Oops", or jokes in errors.',
              'Write "click here" or "learn more" as link text.',
              'Use marketing words: seamless, powerful, unlock, supercharge.',
              'Title Case Every Word.',
            ]}
          />
        </DocSection>
      </article>
    </DocsLayout>
  );
}
