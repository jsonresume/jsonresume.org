'use client';

export const ErrorAlert = ({ error }: { error: string | null }) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 p-4 rounded-md">
      <p className="text-sm text-red-700">{error}</p>
    </div>
  );
};
