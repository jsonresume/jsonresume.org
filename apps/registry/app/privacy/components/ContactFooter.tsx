'use client';

import Link from 'next/link';

export const ContactFooter = () => {
  return (
    <>
      <div className="mt-8 text-gray-600">
        <p>
          For questions about this Privacy Policy, please contact us through{' '}
          <a
            href="https://github.com/jsonresume/jsonresume.org/issues"
            className="font-medium text-gray-900 hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Issues
          </a>
          .
        </p>
      </div>
      <div className="text-center mt-8">
        <Link
          href="/"
          className="font-medium text-gray-900 hover:text-primary transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </>
  );
};
