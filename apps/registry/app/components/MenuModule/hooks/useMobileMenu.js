import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Hook to manage mobile menu state
 * @returns {Object} { isOpen, setIsOpen }
 */
export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when pathname changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return { isOpen, setIsOpen };
}
