'use client';

import { Card, CardContent } from '@repo/ui';
import { PrivacyHeader, ContactFooter, DeleteCacheSection } from './components';
import {
  InformationWeCollect,
  HowWeUseInfo,
  DataStorage,
  DataSharing,
  CookiesAndTracking,
  YourRights,
  ChildrensPrivacy,
  PolicyChanges,
} from './sections/privacySections';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <PrivacyHeader />

        <Card className="mb-8">
          <CardContent className="p-6 prose prose-gray max-w-none">
            <InformationWeCollect />
            <HowWeUseInfo />
            <DataStorage />
            <DataSharing />
            <CookiesAndTracking />
            <YourRights />
            <DeleteCacheSection />
            <ChildrensPrivacy />
            <PolicyChanges />
            <ContactFooter />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
