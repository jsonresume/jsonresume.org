'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@repo/ui';
import { Button } from '@repo/ui';
import Link from 'next/link';
import {
  getReservedUsernameError,
  RESERVED_ROUTES,
} from '@/lib/reservedRoutes';

function ErrorContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const username = searchParams.get('username');

  let title = 'Error';
  let message = 'An error occurred';
  let showReservedList = false;

  if (code === 'reserved_username' && username) {
    title = 'Reserved Username';
    message = getReservedUsernameError(username);
    showReservedList = true;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
              <p className="text-gray-600 mb-8">{message}</p>

              {showReservedList && (
                <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                  <h2 className="text-lg font-semibold mb-3 text-gray-900">
                    Reserved Routes
                  </h2>
                  <p className="text-sm text-gray-600 mb-3">
                    The following routes are reserved for system use:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {RESERVED_ROUTES.map((route) => (
                      <code
                        key={route}
                        className="text-xs bg-white px-2 py-1 rounded border border-gray-200"
                      >
                        /{route}
                      </code>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/">Go Home</Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link href="/explore">Explore Resumes</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
