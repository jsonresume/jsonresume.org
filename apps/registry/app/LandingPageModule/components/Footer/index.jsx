import { BrandSection } from './BrandSection';
import { ResourcesSection } from './ResourcesSection';
import { CommunitySection } from './CommunitySection';
import { LegalSection } from './LegalSection';

export const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <BrandSection />
          <ResourcesSection />
          <CommunitySection />
        </div>
        <LegalSection />
      </div>
    </footer>
  );
};
