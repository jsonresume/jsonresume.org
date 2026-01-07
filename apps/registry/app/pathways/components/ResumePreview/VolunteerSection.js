import { formatDate } from './utils';

export default function VolunteerSection({ volunteer }) {
  if (!volunteer || volunteer.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Volunteer Experience
      </h2>
      <div className="space-y-4">
        {volunteer.map((vol, idx) => (
          <div key={idx}>
            <h3 className="font-semibold text-gray-900">
              {vol.position} at {vol.organization}
            </h3>
            <p className="text-sm text-gray-600">
              {formatDate(vol.startDate)} -{' '}
              {vol.endDate ? formatDate(vol.endDate) : 'Present'}
            </p>
            {vol.summary && <p className="mt-2 text-gray-700">{vol.summary}</p>}
            {vol.highlights && vol.highlights.length > 0 && (
              <ul className="mt-2 space-y-1">
                {vol.highlights.map((highlight, hidx) => (
                  <li key={hidx} className="text-gray-700 flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span className="flex-1">{highlight}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
