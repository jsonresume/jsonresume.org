import Link from 'next/link';
import { history } from '../data/history';

export function HistorySection() {
  return (
    <section className="col-sm-12 project-history" aria-labelledby="history">
      <h2 id="history">Project history</h2>
      <p>
        Thomas Davis and Roland Sharp started JSON Resume in 2014 to describe
        résumé content in a shared JSON format. These milestones link to
        contemporary records of the project.
      </p>
      <ol className="history-list">
        {history.map((event) => (
          <li key={event.date}>
            <time dateTime={event.date}>{event.label}</time>
            <div>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <Link href={event.href}>{event.source}</Link>
            </div>
          </li>
        ))}
      </ol>
      <p>
        For an overview, examples and interview enquiries, visit the{' '}
        <Link href="/media/">media page</Link>.
      </p>
    </section>
  );
}
