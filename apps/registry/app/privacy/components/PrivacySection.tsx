'use client';

import { ReactNode } from 'react';

interface PrivacySectionProps {
  number: string;
  title: string;
  children: ReactNode;
}

export const PrivacySection = ({
  number,
  title,
  children,
}: PrivacySectionProps) => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 mt-8">
        {number}. {title}
      </h2>
      {children}
    </>
  );
};
