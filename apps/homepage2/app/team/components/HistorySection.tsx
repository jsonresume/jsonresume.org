import Link from 'next/link';
import { history } from '../data/history';
import { HistoryNarrative } from './HistoryNarrative';

export function HistorySection() {
  return (
    <section className="col-sm-12 project-history" aria-labelledby="history">
      <h2 id="history">Project history</h2>
      <HistoryNarrative />
      <h3 className="history-milestones-heading">Dated milestones</h3>
      <ol className="history-list">
        {history.map((event) => (
          <li key={event.date}>
            <time dateTime={event.date}>{event.label}</time>
            <div>
              <h4>{event.title}</h4>
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
