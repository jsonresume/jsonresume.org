'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

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

export default function ClientResumes({ initialResumes }) {
  const [filter, setFilter] = useState('');
  const [filteredResumes, setFilteredResumes] = useState(initialResumes);

  useEffect(() => {
    setFilteredResumes(
      initialResumes.filter((resume) =>
        resume?.name?.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter, initialResumes]);

  return (
    <>
      <input
        type="text"
        placeholder="Filter by name..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full p-3 mb-6 border border-gray-300 rounded"
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
              className="flex items-center p-4 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors duration-200"
            >
              <img
                src={resume.image || '/default-avatar.png'}
                alt={resume.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <div className="text-lg font-bold">{resume.name}</div>
                <div className="text-sm text-gray-600">
                  {formatLocation(resume.location)}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </>
  );
}
