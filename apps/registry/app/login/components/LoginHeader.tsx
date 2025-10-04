'use client';

import { Badge } from '@repo/ui';
import { FileJson } from 'lucide-react';

export const LoginHeader = () => {
  return (
    <div className="text-center space-y-2">
      <div className="flex justify-center mb-6">
        <Badge className="animate-pulse" variant="secondary">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-2" />
          Secure GitHub Login
        </Badge>
      </div>
      <div className="flex items-center justify-center gap-2 mb-2">
        <FileJson className="w-8 h-8 text-primary" />
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          JSON Resume
        </h2>
      </div>
      <h3 className="text-xl text-gray-600">Welcome Back</h3>
      <p className="text-gray-600 max-w-sm mx-auto">
        Sign in to manage your resume, explore themes, and share your
        professional profile.
      </p>
    </div>
  );
};
