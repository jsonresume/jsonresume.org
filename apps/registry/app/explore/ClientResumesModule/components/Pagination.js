import { Button } from '@repo/ui';
import { getPageNumbers } from '../utils/paginationUtils';

export function Pagination({
  currentPage,
  totalPages,
  isLoading,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex justify-center gap-2">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
      >
        Previous
      </Button>

      {pageNumbers.map((pageNum, index) => (
        <Button
          key={index}
          variant={pageNum === currentPage ? 'default' : 'outline'}
          onClick={() => {
            if (typeof pageNum === 'number') {
              onPageChange(pageNum);
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
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
      >
        Next
      </Button>
    </div>
  );
}
