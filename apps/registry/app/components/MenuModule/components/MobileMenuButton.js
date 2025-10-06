import { Menu, X } from 'lucide-react';
import { Button } from '@repo/ui';

/**
 * Mobile menu toggle button
 * @param {boolean} isOpen - Whether menu is open
 * @param {Function} onClick - Click handler
 */
export function MobileMenuButton({ isOpen, onClick }) {
  return (
    <Button variant="ghost" size="icon" onClick={onClick} className="md:hidden">
      <span className="sr-only">Open main menu</span>
      {isOpen ? (
        <X className="block h-5 w-5" />
      ) : (
        <Menu className="block h-5 w-5" />
      )}
    </Button>
  );
}
