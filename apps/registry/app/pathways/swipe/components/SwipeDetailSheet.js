'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import JobDetailContent from './JobDetailContent';

export default function SwipeDetailSheet({
  job,
  onClose,
  onInterested,
  onPass,
}) {
  if (!job) return null;

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

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <JobDetailContent job={job} />

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
