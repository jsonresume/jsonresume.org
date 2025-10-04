import { CheckCircle } from 'lucide-react';

export const RequirementsSection = ({ requirements }) => {
  if (!requirements || requirements.length === 0) return null;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Requirements</h2>
      <ul className="space-y-2">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600">{req}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
