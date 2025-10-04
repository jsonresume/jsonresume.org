export const ExperienceSection = ({ experience }) => {
  if (!experience) return null;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Experience Level</h2>
      <p className="text-gray-600">{experience}</p>
    </div>
  );
};
