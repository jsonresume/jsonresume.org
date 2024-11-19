'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Briefcase,
  Building,
  Calendar,
  DollarSign,
  Clock,
  Filter,
} from 'lucide-react';

export const JobList = ({ jobs }) => {
  return (
    <div className="space-y-6">
      <AnimatePresence>
        {jobs.map((job) => (
          <JobItem key={job.uuid} job={job} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder="Search jobs..."
      />
    </div>
  );
};

export const Filters = ({
  selectedJobType,
  setSelectedJobType,
  selectedExperience,
  setSelectedExperience,
}) => {
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
  const experienceLevels = [
    'Entry Level',
    'Mid Level',
    'Senior Level',
    'Lead',
    'Manager',
  ];

  return (
    <div className="w-64 space-y-6">
      <div>
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Job Type</h3>
            <div className="space-y-2">
              {jobTypes.map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="radio"
                    name="jobType"
                    value={type}
                    checked={selectedJobType === type}
                    onChange={(e) => setSelectedJobType(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">{type}</span>
                </label>
              ))}
              {selectedJobType && (
                <button
                  onClick={() => setSelectedJobType('')}
                  className="text-sm text-blue-600 hover:text-blue-500 mt-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Experience
            </h3>
            <div className="space-y-2">
              {experienceLevels.map((level) => (
                <label key={level} className="flex items-center">
                  <input
                    type="radio"
                    name="experience"
                    value={level}
                    checked={selectedExperience === level}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">{level}</span>
                </label>
              ))}
              {selectedExperience && (
                <button
                  onClick={() => setSelectedExperience('')}
                  className="text-sm text-blue-600 hover:text-blue-500 mt-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobItem = ({ job }) => {
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
    console.log('Navigating to job:', job.uuid);
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
};
