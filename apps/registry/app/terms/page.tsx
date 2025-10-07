'use client';

import { Card, CardContent } from '@repo/ui';
import { TermsHeader, ContactFooter } from './components';
import {
  TermsIntro,
  UseLicense,
  Disclaimer,
  Limitations,
  UserContent,
  ServiceModifications,
  GoverningLaw,
} from './sections/termsSections';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <TermsHeader />

        <Card className="mb-8">
          <CardContent className="p-6 prose prose-gray max-w-none">
            <TermsIntro />
            <UseLicense />
            <Disclaimer />
            <Limitations />
            <UserContent />
            <ServiceModifications />
            <GoverningLaw />
            <ContactFooter />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
