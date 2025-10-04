'use client';

import Link from 'next/link';

export const TermsFooter = () => {
  return (
    <div className="text-center">
      <p className="text-sm text-gray-600">
        By signing in, you agree to our{' '}
        <Link
          href="/terms"
          className="font-medium text-gray-900 hover:text-primary transition-colors"
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href="/privacy"
          className="font-medium text-gray-900 hover:text-primary transition-colors"
        >
          Privacy Policy
        </Link>
      </p>
    </div>
  );
};
