import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center m-8">
      <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg">
        <svg
          className="animate-spin h-10 w-10 text-secondary-500 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l2.414 2.415A8.001 8.001 0 014 12H0c0 2.489.92 4.778 2.414 6.585l1.586-1.294z"
          ></path>
        </svg>
        <div className="text-secondary-700 text-lg font-medium">Loading...</div>
      </div>
    </div>
  );
};

export default Loading;
