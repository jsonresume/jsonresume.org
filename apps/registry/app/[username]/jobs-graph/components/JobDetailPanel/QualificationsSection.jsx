import { highlightText } from '../../utils/textUtils';

export function QualificationsSection({ qualifications, filterText }) {
  if (!qualifications || qualifications.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-900 mb-2">
        Qualifications
      </h4>
      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
        {qualifications.map((qual, index) => (
          <li key={index}>
            {filterText ? highlightText(qual, filterText) : qual}
          </li>
        ))}
      </ul>
    </div>
  );
}
