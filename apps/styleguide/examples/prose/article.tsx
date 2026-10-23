import { Prose } from '@jsonresume/ui';

export default function ProseArticle() {
  return (
    <Prose>
      <h2>Why JSON?</h2>
      <p>
        We believe the strengths of the JSON format make it a good fit for
        resumes. It&apos;s lightweight, easy to use and{' '}
        <a href="https://jsonresume.org/schema">well specified</a>.
      </p>
      <ul>
        <li>Write it once, render it in any theme.</li>
        <li>
          Validate it with <code>resume validate</code>.
        </li>
      </ul>
      <blockquote>For developers, by developers.</blockquote>
    </Prose>
  );
}
