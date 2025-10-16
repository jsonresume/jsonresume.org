import { ratingScale, severityLevels } from './data';

export const RatingScale = () => {
  return (
    <>
      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        Rating Scale
      </h3>
      <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
        {ratingScale.map((rating, index) => (
          <li key={index}>
            <strong className="text-gray-900">{rating.label}:</strong>{' '}
            {rating.description}
          </li>
        ))}
      </ul>
    </>
  );
};

export const SeverityLevels = () => {
  return (
    <>
      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        Severity Levels
      </h3>
      <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
        {severityLevels.map((level, index) => (
          <li key={index}>
            <strong className={level.color}>{level.level}:</strong>{' '}
            {level.description}
          </li>
        ))}
      </ul>
    </>
  );
};
