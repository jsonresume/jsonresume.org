'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Briefcase,
  ExternalLink,
  LayoutDashboard,
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@repo/ui/components/ui/card';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';

export default function ClientResumes({
  initialResumes,
  currentPage,
  totalPages,
  currentSearch,
}) {
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
      params.delete('page'); // Reset to first page on new search
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

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search resumes by name, skills, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 h-12 text-lg bg-white"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Resume Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {isLoading
          ? // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          : initialResumes.map((resume) => (
              <Card
                key={resume.username}
                className="h-full hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <img
                      src={resume.image}
                      alt={resume.name || resume.username}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 truncate">
                        {resume.name || resume.username}
                      </h3>

                      {resume.label && (
                        <p className="text-gray-600 text-sm mb-2 truncate">
                          <Briefcase className="inline-block w-4 h-4 mr-1 -mt-0.5" />
                          {resume.label}
                        </p>
                      )}

                      {resume.location?.city && (
                        <p className="text-gray-500 text-sm flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">
                            {[
                              resume.location.city,
                              resume.location.region,
                              resume.location.countryCode,
                            ]
                              .filter(Boolean)
                              .join(', ')}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="px-6 py-4 border-t flex gap-2 justify-end bg-gray-50">
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/${resume.username}`}
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Resume
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/${resume.username}/dashboard`}
                      className="flex items-center gap-1"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </Button>

          {getPageNumbers().map((pageNum, index) => (
            <Button
              key={index}
              variant={pageNum === currentPage ? 'default' : 'outline'}
              onClick={() => {
                if (typeof pageNum === 'number') {
                  handlePageChange(pageNum);
                }
              }}
              disabled={isLoading || typeof pageNum !== 'number'}
              className={pageNum === '...' ? 'pointer-events-none' : ''}
            >
              {pageNum}
            </Button>
          ))}

          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
