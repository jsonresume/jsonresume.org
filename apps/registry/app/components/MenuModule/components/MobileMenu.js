import { Card, CardContent } from '@repo/ui';
import { NavLinks } from './NavLinks';
import { AuthLinks } from './AuthLinks';

/**
 * Mobile menu dropdown
 * @param {boolean} isOpen - Whether menu is open
 * @param {Object} user - Current user
 * @param {Function} onSignOut - Sign out handler
 */
export function MobileMenu({ isOpen, user, onSignOut }) {
  if (!isOpen) return null;

  return (
    <Card className="md:hidden mt-2 mb-4 bg-white/80 backdrop-blur-xl border-gray-900/10">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <NavLinks />
          </div>
          <div className="border-t border-gray-900/10 pt-4 flex flex-col gap-4">
            <AuthLinks user={user} onSignOut={onSignOut} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
