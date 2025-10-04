export const AdditionalSection = ({ additional }) => {
  if (!additional) return null;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
      <p className="text-gray-600">{additional}</p>
    </div>
  );
};
