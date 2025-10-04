import { CheckCircle } from 'lucide-react';

export const ResponsibilitiesSection = ({ responsibilities }) => {
  if (!responsibilities || responsibilities.length === 0) return null;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Key Responsibilities</h2>
      <ul className="space-y-2">
        {responsibilities.map((resp, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600">{resp}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
