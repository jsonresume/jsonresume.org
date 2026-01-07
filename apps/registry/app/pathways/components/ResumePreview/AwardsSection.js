import { Award } from 'lucide-react';
import { formatDate } from './utils';

export default function AwardsSection({ awards }) {
  if (!awards || awards.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Award className="w-6 h-6 text-indigo-600" />
        Awards
      </h2>
      <div className="space-y-4">
        {awards.map((award, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <Award className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900">{award.title}</h3>
              <p className="text-gray-600">
                {award.awarder} • {formatDate(award.date)}
              </p>
              {award.summary && (
                <p className="mt-1 text-gray-700">{award.summary}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
