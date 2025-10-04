'use client';

import { ArrowLeft } from 'lucide-react';

export const BackButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back to Jobs
    </button>
  );
};
