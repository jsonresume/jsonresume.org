import { ArrowLeft } from 'lucide-react';
import { Button } from '@repo/ui';

export const NotFoundState = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Job not found</h1>
        <p className="text-gray-600 mb-8">
          The job you're looking for doesn't exist or has been removed.
        </p>
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>
      </div>
    </div>
  );
};
