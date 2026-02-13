'use client';

import React from 'react';

const COLOR_SCHEMES = {
  blue: 'bg-blue-50/80 text-blue-900 border-blue-200',
  purple: 'bg-purple-50/80 text-purple-900 border-purple-200',
  indigo: 'bg-indigo-50/80 text-indigo-900 border-indigo-200',
  amber: 'bg-amber-50/80 text-amber-900 border-amber-200',
  green: 'bg-green-50/80 text-green-900 border-green-200',
  gray: 'bg-gray-50/80 text-gray-600 border-gray-200',
  cyan: 'bg-cyan-50/80 text-cyan-900 border-cyan-200',
};

export function ToolCard({
  icon,
  title,
  color = 'gray',
  children,
  showSuccess,
  successMessage = 'Complete',
}) {
  const colorClass = COLOR_SCHEMES[color] || COLOR_SCHEMES.gray;

  return (
    <div
      className={`p-3 rounded-lg border ${colorClass} text-xs space-y-1.5 transition-all`}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">
          {icon} {title}
        </span>
        {showSuccess && <span className="text-green-600 text-[10px]">✓</span>}
      </div>
      {children}
      {showSuccess && (
        <div className="text-green-700/80 text-[10px] font-medium">
          {successMessage}
        </div>
      )}
    </div>
  );
}

export function ToolDetails({ label, data }) {
  if (!data) return null;

  return (
    <details className="mt-1.5">
      <summary className="cursor-pointer text-[10px] font-medium opacity-70 hover:opacity-100">
        {label}
      </summary>
      <pre className="whitespace-pre-wrap break-words bg-white/60 p-2 rounded mt-1 text-[10px] max-h-32 overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  );
}
