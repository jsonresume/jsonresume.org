import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function useSearchAndPagination(
  currentSearch,
  currentPage,
  initialResumes
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(currentSearch);
  const [isLoading, setIsLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update URL when search changes
  useEffect(() => {
    if (debouncedSearch === currentSearch) return;

    setIsLoading(true);
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
      params.delete('page');
    } else {
      params.delete('search');
    }
    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedSearch, router, searchParams, currentSearch, pathname]);

  const handlePageChange = (newPage) => {
    setIsLoading(true);
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Reset loading state when new data arrives
  useEffect(() => {
    setIsLoading(false);
  }, [initialResumes]);

  return {
    searchTerm,
    setSearchTerm,
    isLoading,
    handlePageChange,
  };
}
