'use client';

import { motion } from 'framer-motion';
import { logger } from '@/lib/logger';
import { useRouter } from 'next/navigation';
import { MapPin, Building, DollarSign } from 'lucide-react';

export function JobItem({ job }) {
  const router = useRouter();
  const gptContent =
    job.gpt_content && job.gpt_content !== 'FAILED'
      ? JSON.parse(job.gpt_content)
      : {};

  // Extract and format location
  const location = gptContent.location || {};
  const locationString = [location.city, location.region, location.countryCode]
    .filter(Boolean)
    .join(', ');

  // Format salary if available
  const salary = gptContent.salary
    ? `$${Number(gptContent.salary).toLocaleString()}/year`
    : 'Not specified';

  const handleClick = () => {
    logger.debug(job.uuid, 'Navigating to job:');
    router.push(`/jobs/${job.uuid}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-black mb-2">
            {gptContent.title || 'Untitled Position'}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <Building className="mr-2" size={16} />
            <span>{gptContent.company || 'Company not specified'}</span>
          </div>
          {locationString && (
            <div className="flex items-center text-gray-600">
              <MapPin className="mr-2" size={16} />
              <span>{locationString}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end">
          <div className="text-gray-600 mb-2">
            <DollarSign className="inline mr-1" size={16} />
            {salary}
          </div>
          {gptContent.type && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {gptContent.type}
            </span>
          )}
        </div>
      </div>
      {gptContent.description && (
        <p className="text-gray-600 line-clamp-3">{gptContent.description}</p>
      )}
    </motion.div>
  );
}
