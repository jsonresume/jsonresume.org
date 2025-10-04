import { CheckCircle } from 'lucide-react';

export const BenefitsSection = ({ benefits }) => {
  if (!benefits || benefits.length === 0) return null;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Benefits & Perks</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefits.map((benefit, index) => (
          <li
            key={index}
            className="flex items-center bg-gray-50 rounded-lg p-3"
          >
            <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
            <span className="text-gray-600">{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
