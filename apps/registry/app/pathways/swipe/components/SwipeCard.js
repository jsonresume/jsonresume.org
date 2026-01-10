'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { MapPin, Building2, DollarSign, Wifi } from 'lucide-react';

const SWIPE_THRESHOLD = 100;

export default function SwipeCard({
  job,
  onSwipeRight,
  onSwipeLeft,
  onTap,
  isBackground = false,
}) {
  const x = useMotionValue(0);

  // Transform x position to rotation and opacity
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipeRight?.();
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipeLeft?.();
    }
  };

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
  const skills = job.skills?.slice(0, 5) || [];

  if (isBackground) {
    return (
      <div className="absolute inset-0 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 bg-white rounded-2xl shadow-xl cursor-grab active:cursor-grabbing overflow-hidden"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      style={{ x, rotate }}
      whileTap={{ scale: 0.98 }}
      onClick={onTap}
    >
      {/* Like indicator */}
      <motion.div
        className="absolute top-8 left-8 z-10 px-4 py-2 border-4 border-green-500 rounded-lg"
        style={{ opacity: likeOpacity, rotate: -15 }}
      >
        <span className="text-2xl font-bold text-green-500">LIKE</span>
      </motion.div>

      {/* Nope indicator */}
      <motion.div
        className="absolute top-8 right-8 z-10 px-4 py-2 border-4 border-red-500 rounded-lg"
        style={{ opacity: nopeOpacity, rotate: 15 }}
      >
        <span className="text-2xl font-bold text-red-500">NOPE</span>
      </motion.div>

      {/* Card content */}
      <div className="h-full flex flex-col p-6">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
            {job.title || 'Unknown Position'}
          </h2>
          <div className="flex items-center text-gray-600">
            <Building2 className="w-4 h-4 mr-1.5 flex-shrink-0" />
            <span className="truncate">{job.company || 'Unknown Company'}</span>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-2 mb-4">
          {location && (
            <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              {location}
            </span>
          )}
          {job.remote && (
            <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
              <Wifi className="w-3.5 h-3.5 mr-1" />
              Remote
            </span>
          )}
          {salary && (
            <span className="inline-flex items-center px-2.5 py-1 bg-green-100 text-green-700 text-sm rounded-full">
              <DollarSign className="w-3.5 h-3.5 mr-1" />
              {salary}
            </span>
          )}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded"
              >
                {typeof skill === 'string' ? skill : skill?.name || 'Unknown'}
              </span>
            ))}
          </div>
        )}

        {/* Description preview */}
        <div className="flex-1 overflow-hidden">
          <p className="text-gray-600 text-sm line-clamp-6">
            {job.description || 'No description available.'}
          </p>
        </div>

        {/* Tap hint */}
        <div className="mt-4 text-center text-gray-400 text-sm">
          Tap for details
        </div>
      </div>
    </motion.div>
  );
}
