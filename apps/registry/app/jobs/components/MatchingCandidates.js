'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';

export default function MatchingCandidates({ jobId }) {
  const [candidates, setcandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const { data } = await axios.get(`/api/candidates?jobId=${jobId}`);
        setcandidates(data.candidates);
        setError(null);
      } catch (err) {
        console.error('Error fetching candidates:', err);
        setError('Failed to load matching candidates');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [jobId]);

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Matching Candidates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white rounded-lg shadow-sm p-4"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 text-center text-gray-500">
        {error}
      </div>
    );
  }

  if (!candidates?.length) {
    return (
      <div className="mt-8 text-center text-gray-500">
        No matching candidates found
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Top Matching Candidates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidates.map((candidate, index) => (
          <motion.div
            key={candidate.username}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <Link
              href={`/${candidate.username}`}
              className="flex items-start space-x-4"
            >
              <img
                src={candidate.image}
                alt={candidate.name || 'Profile'}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold truncate">
                    {candidate.name || 'Anonymous'}
                  </h3>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm">
                      {Math.round(candidate.similarity * 100)}%
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 truncate">{candidate.label}</p>
                {candidate.location && (
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>
                      {candidate.location.city}, {candidate.location.countryCode}
                    </span>
                  </div>
                )}
                {candidate.skills?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {candidate.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 3 && (
                      <span className="text-gray-500 text-xs">
                        +{candidate.skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
