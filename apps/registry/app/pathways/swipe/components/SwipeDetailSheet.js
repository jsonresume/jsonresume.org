'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Building2,
  DollarSign,
  Wifi,
  ExternalLink,
  Heart,
} from 'lucide-react';

export default function SwipeDetailSheet({
  job,
  onClose,
  onInterested,
  onPass,
}) {
  if (!job) return null;

  // Format salary display
  const formatSalary = () => {
    if (job.salaryMin && job.salaryMax) {
      const min = Math.round(job.salaryMin / 1000);
      const max = Math.round(job.salaryMax / 1000);
      return `$${min}k - $${max}k`;
    }
    if (job.salaryUsd) {
      return `$${Math.round(job.salaryUsd / 1000)}k`;
    }
    return null;
  };

  // Format location
  const formatLocation = () => {
    if (typeof job.location === 'string') return job.location;
    if (job.location?.city && job.location?.region) {
      return `${job.location.city}, ${job.location.region}`;
    }
    if (job.location?.city) return job.location.city;
    return null;
  };

  const salary = formatSalary();
  const location = formatLocation();

  return (
    <AnimatePresence>
      {job && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center py-3">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {/* Header */}
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-1 pr-8">
                  {job.title || 'Unknown Position'}
                </h2>
                <div className="flex items-center text-gray-600">
                  <Building2 className="w-4 h-4 mr-1.5 flex-shrink-0" />
                  <span>{job.company || 'Unknown Company'}</span>
                </div>
              </div>

              {/* Meta badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {location && (
                  <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full">
                    <MapPin className="w-4 h-4 mr-1.5" />
                    {location}
                  </span>
                )}
                {job.remote && (
                  <span className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-full">
                    <Wifi className="w-4 h-4 mr-1.5" />
                    Remote
                  </span>
                )}
                {salary && (
                  <span className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-full">
                    <DollarSign className="w-4 h-4 mr-1.5" />
                    {salary}
                  </span>
                )}
              </div>

              {/* Skills */}
              {job.skills?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-sm rounded"
                      >
                        {typeof skill === 'string'
                          ? skill
                          : skill?.name || 'Unknown'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bonus skills */}
              {job.bonusSkills?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Bonus Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.bonusSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-gray-100 text-gray-600 text-sm rounded"
                      >
                        {typeof skill === 'string'
                          ? skill
                          : skill?.name || 'Unknown'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 text-sm whitespace-pre-line">
                  {job.description || 'No description available.'}
                </p>
              </div>

              {/* External link */}
              {job.url && (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium mb-6"
                >
                  <ExternalLink className="w-4 h-4 mr-1.5" />
                  View Original Posting
                </a>
              )}
            </div>

            {/* Action buttons */}
            <div className="border-t border-gray-200 px-6 py-4 flex gap-3 safe-area-bottom">
              <button
                onClick={onPass}
                className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Pass
              </button>
              <button
                onClick={onInterested}
                className="flex-1 py-3 px-4 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Interested
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
