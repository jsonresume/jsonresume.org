import { CheckCircle } from 'lucide-react';

export function ResponsibilitiesList({ responsibilities }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-3 text-gray-800">
        Responsibilities
      </h2>
      <ul className="list-none">
        {responsibilities?.length ? (
          responsibilities.map((resp, index) => (
            <li key={index} className="flex items-start mb-2">
              <CheckCircle className="w-5 h-5 mr-2 text-success-500 flex-shrink-0 mt-1" />
              <span>{resp}</span>
            </li>
          ))
        ) : (
          <p>Not available</p>
        )}
      </ul>
    </div>
  );
}
