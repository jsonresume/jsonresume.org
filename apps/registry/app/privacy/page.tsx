'use client'

import { Card, CardContent } from "@repo/ui/components/ui/card"
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: January 24, 2025</p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6 prose prose-gray max-w-none">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p>
              When you use JSON Resume, we collect and process the following information:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>GitHub authentication data (when you sign in with GitHub)</li>
              <li>Resume data that you explicitly provide</li>
              <li>Basic usage analytics (page views, error logs)</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4 mt-8">2. How We Use Your Information</h2>
            <p>
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>To provide and maintain the JSON Resume service</li>
              <li>To authenticate you via GitHub</li>
              <li>To store and display your resume data</li>
              <li>To improve the service through analytics</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4 mt-8">3. Data Storage and Security</h2>
            <p>
              Your resume data is stored in GitHub Gists under your control. We do not maintain a 
              separate database of resume content. Authentication is handled securely through GitHub's OAuth system.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">4. Data Sharing</h2>
            <p>
              We do not sell or share your personal information with third parties. Your resume data 
              is public or private according to your GitHub Gist settings. We recommend reviewing your 
              GitHub privacy settings to ensure your resume data is shared according to your preferences.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">5. Cookies and Tracking</h2>
            <p>
              We use minimal cookies necessary for authentication and basic site functionality. 
              We may use basic analytics to understand site usage patterns, but we do not track 
              individual users or collect detailed personal information.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">6. Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Access your resume data (through your GitHub account)</li>
              <li>Delete your resume data (by deleting your GitHub Gist)</li>
              <li>Revoke JSON Resume's access to your GitHub account</li>
              <li>Request information about what data we have about you</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4 mt-8">7. Children's Privacy</h2>
            <p>
              Our service is not directed to children under 13. We do not knowingly collect personal 
              information from children under 13. If you are under 13, please do not use our service 
              or provide any personal information.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">8. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify users of any material 
              changes by posting the new privacy policy on this page.
            </p>

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
                </a>.
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
  )
}
