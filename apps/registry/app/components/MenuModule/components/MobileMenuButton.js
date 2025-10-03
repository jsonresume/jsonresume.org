import { Menu, X } from 'lucide-react';

/**
 * Mobile menu toggle button
 * @param {boolean} isOpen - Whether menu is open
 * @param {Function} onClick - Click handler
 */
export function MobileMenuButton({ isOpen, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:bg-gray-900/5 md:hidden"
    >
      <span className="sr-only">Open main menu</span>
      {isOpen ? (
        <X className="block h-5 w-5" />
      ) : (
        <Menu className="block h-5 w-5" />
      )}
    </button>
  );
}
