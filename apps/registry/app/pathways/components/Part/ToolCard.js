import React from 'react';

const COLOR_SCHEMES = {
  blue: 'bg-blue-50 text-blue-900',
  purple: 'bg-purple-50 text-purple-900',
  indigo: 'bg-indigo-50 text-indigo-900',
  amber: 'bg-amber-50 text-amber-900',
  green: 'bg-green-50 text-green-900',
  gray: 'bg-gray-50 text-gray-600',
};

export default function ToolCard({
  icon,
  title,
  color = 'gray',
  children,
  showSuccess,
  successMessage = 'Complete',
}) {
  const colorClass = COLOR_SCHEMES[color] || COLOR_SCHEMES.gray;

  return (
    <div className={`p-2 rounded-lg ${colorClass} text-xs space-y-2`}>
      <div className="font-semibold">
        {icon} {title}
      </div>
      {children}
      {showSuccess && (
        <div className="text-green-700 font-medium mt-2">
          ✓ {successMessage}
        </div>
      )}
    </div>
  );
}

export function ToolDetails({ label, data }) {
  if (!data) return null;

  return (
    <details className="mt-2">
      <summary className="cursor-pointer text-xs font-medium">{label}</summary>
      <pre className="whitespace-pre-wrap break-words bg-white/50 p-2 rounded mt-1 text-xs">
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  );
}
