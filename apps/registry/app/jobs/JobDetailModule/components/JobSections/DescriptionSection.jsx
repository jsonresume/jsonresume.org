export const DescriptionSection = ({ description }) => {
  if (!description) return null;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">About This Role</h2>
      <div
        className="text-gray-600"
        dangerouslySetInnerHTML={{
          __html: description.replace(/\n/g, '<br />'),
        }}
      />
    </div>
  );
};
