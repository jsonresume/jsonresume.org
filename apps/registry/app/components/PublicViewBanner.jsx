'use client';

import { X, Lock } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@repo/ui/components/ui/button';

/**
 * Banner shown on public dashboard pages to indicate public access mode
 * Shows login CTA and link to private dashboard features
 */
export function PublicViewBanner({ username }) {
  const [dismissed, setDismissed] = useState(false);
  const router = useRouter();

  if (dismissed) return null;

  return (
    <div className="bg-blue-50 border-b border-blue-200">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="text-blue-600">
              <Lock className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Public View:</span> You&apos;re
                viewing <span className="font-semibold">@{username}</span>
                &apos;s public profile.
              </p>
              <p className="text-xs text-blue-700 mt-0.5">
                Login to access AI suggestions, cover letters, and interview
                practice.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => router.push('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Login as @{username}
            </Button>
            <button
              onClick={() => setDismissed(true)}
              className="text-blue-600 hover:text-blue-800 p-1"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
