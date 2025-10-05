import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@repo/ui';

export function AuthRequired({ username, session }) {
  const router = useRouter();
  const currentUsername = session?.username;

  return (
    <div className="max-w-2xl mx-auto text-center py-20 px-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Authentication Required
        </h2>
        {!session ? (
          <>
            <p className="text-gray-600 mb-6">
              This dashboard page requires you to be logged in as{' '}
              <span className="font-semibold">@{username}</span>.
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => router.push('/login')}
                className="w-full sm:w-auto"
              >
                Log In to View Dashboard
              </Button>
              <p className="text-sm text-gray-500">
                Want to view the public resume?{' '}
                <Link
                  href={`/${username}`}
                  className="text-blue-600 hover:underline"
                >
                  Visit @{username}'s profile
                </Link>
              </p>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-2">
              You are currently logged in as{' '}
              <span className="font-semibold">@{currentUsername}</span>, but
              this dashboard belongs to{' '}
              <span className="font-semibold">@{username}</span>.
            </p>
            <p className="text-gray-500 mb-6 text-sm">
              You need to be logged in as the correct user to access this page.
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => router.push('/login')}
                className="w-full sm:w-auto"
              >
                Switch Account
              </Button>
              <p className="text-sm text-gray-500">
                Want to view the public resume?{' '}
                <Link
                  href={`/${username}`}
                  className="text-blue-600 hover:underline"
                >
                  Visit @{username}'s profile
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
