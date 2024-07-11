import React from 'react';

export default function Hero({ title, description }) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-12 px-6 rounded-lg shadow-lg mb-10 text-center">
      <h1 className="text-4xl font-extrabold mb-4">{title}</h1>
      <p className="text-xl font-light">{description}</p>
    </div>
  );
}
