'use client';

import { useSearchAndPagination } from './ClientResumesModule/hooks/useSearchAndPagination';
import { SearchBar } from './ClientResumesModule/components/SearchBar';
import { LoadingSkeleton } from './ClientResumesModule/components/LoadingSkeleton';
import { ResumeCard } from './ClientResumesModule/components/ResumeCard';
import { Pagination } from './ClientResumesModule/components/Pagination';

export default function ClientResumes({
  initialResumes,
  currentPage,
  totalPages,
  currentSearch,
}) {
  const { searchTerm, setSearchTerm, isLoading, handlePageChange } =
    useSearchAndPagination(currentSearch, currentPage, initialResumes);

  return (
    <div>
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          initialResumes.map((resume) => (
            <ResumeCard key={resume.username} resume={resume} />
          ))
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        isLoading={isLoading}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
