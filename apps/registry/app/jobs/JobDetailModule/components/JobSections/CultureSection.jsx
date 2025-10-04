export const CultureSection = ({ culture }) => {
  if (!culture) return null;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Company Culture</h2>
      <p className="text-gray-600">{culture}</p>
    </div>
  );
};
