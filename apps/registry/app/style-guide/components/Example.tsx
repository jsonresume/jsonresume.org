import { ReactNode } from 'react';

interface ExampleProps {
  children: ReactNode;
  title?: string;
}

export function Example({ children, title }: ExampleProps) {
  return (
    <div className="mb-6">
      {title && (
        <h4 className="text-sm font-semibold text-gray-700 mb-3">{title}</h4>
      )}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {children}
      </div>
    </div>
  );
}
