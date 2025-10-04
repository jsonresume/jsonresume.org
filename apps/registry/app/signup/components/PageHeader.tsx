import Link from 'next/link';

export const PageHeader = () => {
  return (
    <div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Create your account
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Or{' '}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          sign in to your existing account
        </Link>
      </p>
    </div>
  );
};
