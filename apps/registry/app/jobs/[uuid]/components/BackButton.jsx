'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@repo/ui';

export const BackButton = ({ onClick }) => {
  return (
    <Button variant="ghost" onClick={onClick} className="mb-8">
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back to Jobs
    </Button>
  );
};
