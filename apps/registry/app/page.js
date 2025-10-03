'use server';

import { auth } from '../auth';
import { redirect } from 'next/navigation';
import { HeroSection } from './LandingPageModule/components/HeroSection';
import { FeaturesGrid } from './LandingPageModule/components/FeaturesGrid';
import { CTASection } from './LandingPageModule/components/CTASection';
import { Footer } from './LandingPageModule/components/Footer';

export default async function Page() {
  const session = await auth();

  if (session) {
    redirect(`/editor`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <HeroSection />
      <FeaturesGrid />
      <CTASection />
      <Footer />
    </div>
  );
}
