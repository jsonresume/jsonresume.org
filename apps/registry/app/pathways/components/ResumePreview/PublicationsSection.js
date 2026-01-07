import { formatDate } from './utils';

export default function PublicationsSection({ publications }) {
  if (!publications || publications.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Publications
      </h2>
      <div className="space-y-4">
        {publications.map((pub, idx) => (
          <div key={idx}>
            <h3 className="font-semibold text-gray-900">{pub.name}</h3>
            <p className="text-gray-600">
              {pub.publisher} • {formatDate(pub.releaseDate)}
            </p>
            {pub.summary && <p className="mt-1 text-gray-700">{pub.summary}</p>}
            {pub.url && (
              <a
                href={pub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 text-sm hover:underline"
              >
                View Publication →
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
