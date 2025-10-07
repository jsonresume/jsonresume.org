'use client';

import { ReactNode } from 'react';

interface TermsSectionProps {
  number: string;
  title: string;
  children: ReactNode;
}

export const TermsSection = ({
  number,
  title,
  children,
}: TermsSectionProps) => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 mt-8">
        {number}. {title}
      </h2>
      {children}
    </>
  );
};
