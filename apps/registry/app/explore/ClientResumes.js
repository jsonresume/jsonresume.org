'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const formatLocation = (location) => {
  if (!location) return 'Location not provided';

  const {
    postalCode = '',
    city = '',
    region = '',
    countryCode = '',
  } = location;

  const locationParts = [city, region, postalCode, countryCode].filter(
    (part) => part.trim() !== ''
  );

  if (locationParts.length === 0) return 'Location not provided';

  return locationParts.join(', ');
};

function PaginationButton({ children, onClick, disabled, active }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 text-sm font-medium rounded-md 
        ${
          active
            ? 'bg-primary-600 text-white'
            : disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }
        border border-gray-300
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
        transition-colors duration-200
      `}
    >
      {children}
    </button>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <PaginationButton
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        «
      </PaginationButton>
      <PaginationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ‹
      </PaginationButton>

      {startPage > 1 && (
        <>
          <PaginationButton onClick={() => onPageChange(1)}>1</PaginationButton>
          {startPage > 2 && (
            <span className="px-2 text-gray-500">...</span>
          )}
        </>
      )}

      {pages.map((page) => (
        <PaginationButton
          key={page}
          onClick={() => onPageChange(page)}
          active={page === currentPage}
        >
          {page}
        </PaginationButton>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="px-2 text-gray-500">...</span>
          )}
          <PaginationButton onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </PaginationButton>
        </>
      )}

      <PaginationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        ›
      </PaginationButton>
      <PaginationButton
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        »
      </PaginationButton>
    </div>
  );
}

export default function ClientResumes({ initialResumes, currentPage, totalPages }) {
  const [filter, setFilter] = useState('');
  const [filteredResumes, setFilteredResumes] = useState(initialResumes);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setFilteredResumes(
      initialResumes.filter((resume) =>
        resume?.name?.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter, initialResumes]);

  const handlePageChange = (page) => {
    const searchParams = new URLSearchParams();
    if (page > 1) searchParams.set('page', page.toString());
    const query = searchParams.toString();
    router.push(`${pathname}${query ? `?${query}` : ''}`);
  };

  return (
    <div className="space-y-6">
      <input
        type="text"
        placeholder="Filter by name..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
      
      <div className="flex flex-col gap-4">
        {filteredResumes.map((resume, index) => (
          <motion.div
            key={resume.username || index}
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={`/${resume.username}/dashboard`}
              className="flex items-center p-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm"
            >
              <img
                src={resume.image || '/default-avatar.png'}
                alt={resume.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <div className="text-lg font-bold text-gray-900">{resume.name}</div>
                <div className="text-sm text-gray-600">
                  {formatLocation(resume.location)}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {!filter && totalPages > 1 && (
        <div className="mt-8 pb-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
