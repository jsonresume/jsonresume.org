import { CheckCircle } from 'lucide-react';

export function QualificationsList({ qualifications }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-3 text-gray-800">
        Qualifications
      </h2>
      <ul className="list-none">
        {qualifications?.length ? (
          qualifications.map((qual, index) => (
            <li key={index} className="flex items-start mb-2">
              <CheckCircle className="w-5 h-5 mr-2 text-secondary-500 flex-shrink-0 mt-1" />
              <span>{qual}</span>
            </li>
          ))
        ) : (
          <p>Not available</p>
        )}
      </ul>
    </div>
  );
}
