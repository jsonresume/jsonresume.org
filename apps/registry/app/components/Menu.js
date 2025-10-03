'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from './MenuModule/hooks/useAuth';
import { useMobileMenu } from './MenuModule/hooks/useMobileMenu';
import { Logo } from './MenuModule/components/Logo';
import { NavLinks } from './MenuModule/components/NavLinks';
import { AuthLinks } from './MenuModule/components/AuthLinks';
import { MobileMenuButton } from './MenuModule/components/MobileMenuButton';
import { MobileMenu } from './MenuModule/components/MobileMenu';

export default function Menu() {
  const { user, handleSignOut } = useAuth();
  const { isOpen, setIsOpen } = useMobileMenu();
  const pathname = usePathname();

  // Hide menu on Pathways page
  if (pathname?.startsWith('/pathways')) {
    return null;
  }

  return (
    <div className="bg-primary border-b border-gray-900/10">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <NavLinks />
          </div>

          {/* Desktop Auth Links and Mobile Menu Button */}
          <div className="flex items-center gap-6 justify-end">
            <div className="hidden md:flex md:items-center md:gap-6">
              <AuthLinks user={user} onSignOut={handleSignOut} />
            </div>
            <MobileMenuButton
              isOpen={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
        </div>

        <MobileMenu isOpen={isOpen} user={user} onSignOut={handleSignOut} />
      </nav>
    </div>
  );
}
