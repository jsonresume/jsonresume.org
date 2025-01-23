'use client';

import { Card, CardContent } from '@repo/ui/components/ui/card';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600">Last updated: January 24, 2025</p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6 prose prose-gray max-w-none">
            <h2 className="text-2xl font-semibold mb-4">1. Terms</h2>
            <p>
              By accessing JSON Resume, you agree to be bound by these terms of
              service. These terms apply to all users of the site, including
              without limitation users who are contributors to the open-source
              project.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">2. Use License</h2>
            <p>
              JSON Resume is an open-source project. The source code is
              available under the MIT license. You are free to use, modify, and
              distribute the code according to the terms of the MIT license.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">3. Disclaimer</h2>
            <p>
              JSON Resume is provided "as is", without warranty of any kind,
              express or implied. We make no warranties, expressed or implied,
              and hereby disclaim and negate all other warranties, including
              without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or
              non-infringement of intellectual property.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">4. Limitations</h2>
            <p>
              In no event shall JSON Resume or its contributors be liable for
              any damages arising out of the use or inability to use the
              service. This includes but is not limited to damages for loss of
              data or profit, or due to business interruption.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">
              5. User Content
            </h2>
            <p>
              When you create or make available your resume through JSON Resume,
              you represent that:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                The creation and use of your content doesn't violate any
                applicable laws
              </li>
              <li>Your content is your own or you have the right to use it</li>
              <li>
                You understand that your resume may be publicly accessible
              </li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4 mt-8">
              6. Service Modifications
            </h2>
            <p>
              We reserve the right to modify or discontinue, temporarily or
              permanently, the service with or without notice. We shall not be
              liable to you or to any third party for any modification,
              suspension, or discontinuance of the service.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">
              7. Governing Law
            </h2>
            <p>
              These terms shall be governed by and construed in accordance with
              the laws of the jurisdiction in which the project maintainers
              reside, without regard to its conflict of law provisions.
            </p>

            <div className="mt-8 text-gray-600">
              <p>
                For questions about these Terms of Service, please contact us
                through{' '}
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
          </CardContent>
        </Card>

        <div className="text-center">
          <Link
            href="/"
            className="font-medium text-gray-900 hover:text-primary transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
