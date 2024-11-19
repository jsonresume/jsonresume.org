'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Filter,
} from 'lucide-react';
import axios from 'axios';

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/jobs/all');
        setJobs(response.data);
        setFilteredJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    let result = jobs;

    if (searchTerm) {
      result = result.filter(
        (job) =>
          job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedJobType) {
      result = result.filter((job) => job.type === selectedJobType);
    }

    if (selectedExperience) {
      result = result.filter((job) => job.experience === selectedExperience);
    }

    setFilteredJobs(result);
  }, [searchTerm, selectedJobType, selectedExperience, jobs]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Job Board</h1>
        <div className="grid gap-6">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <Filters
            selectedJobType={selectedJobType}
            setSelectedJobType={setSelectedJobType}
            selectedExperience={selectedExperience}
            setSelectedExperience={setSelectedExperience}
          />
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading jobs...</p>
            </div>
          ) : (
            <JobList jobs={filteredJobs} />
          )}
        </div>
      </div>
    </div>
  );
};

const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <div className="relative flex-grow max-w-2xl">
    <input
      type="text"
      placeholder="Search for jobs..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full pl-10 pr-4 py-2 rounded-md border-2 border-gray-300 focus:border-accent focus:ring focus:ring-accent focus:ring-opacity-50"
    />
    <Search
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      size={20}
    />
  </div>
);

const Filters = ({
  selectedJobType,
  setSelectedJobType,
  selectedExperience,
  setSelectedExperience,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-bold mb-4 text-secondary">Filters</h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Job Type</label>
        <select
          value={selectedJobType}
          onChange={(e) => setSelectedJobType(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-accent focus:ring-opacity-50 px-4 py-2"
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Experience Level</label>
        <select
          value={selectedExperience}
          onChange={(e) => setSelectedExperience(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-accent focus:ring-opacity-50 px-4 py-2"
        >
          <option value="">All Levels</option>
          <option value="Entry-level">Entry-level</option>
          <option value="Mid-level">Mid-level</option>
          <option value="Senior-level">Senior-level</option>
        </select>
      </div>
    </motion.div>
  );
};

const JobList = ({ jobs }) => {
  return (
    <div className="w-full md:w-3/4 space-y-6">
      <AnimatePresence>
        {jobs.map((job) => (
          <JobItem key={job.id} job={job} />
        ))}
      </AnimatePresence>
      {jobs.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No jobs found. Try adjusting your filters.
        </p>
      )}
    </div>
  );
};

const JobItem = ({ job }) => {
  const [expanded, setExpanded] = useState(false);
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className={`bg-white p-6 rounded-lg shadow-md cursor-pointer ${
        expanded ? 'border-l-4 border-accent' : ''
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-secondary mb-2">
            {gptContent.title || 'Untitled Position'}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <Briefcase className="mr-2" size={16} />
            <span>{gptContent.company || 'Company not specified'}</span>
          </div>
          {locationString && (
            <div className="flex items-center text-gray-600">
              <MapPin className="mr-2" size={16} />
              <span>{locationString}</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <p className="text-accent font-bold text-xl mb-2">{salary}</p>
          {gptContent.type && (
            <span className="inline-block bg-secondary text-white text-sm px-2 py-1 rounded">
              {gptContent.type}
            </span>
          )}
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {gptContent.description && (
              <p className="text-gray-700 mb-4">{gptContent.description}</p>
            )}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {gptContent.remote && (
                <div className="flex items-center">
                  <Clock className="mr-2 text-accent" size={16} />
                  <span>{gptContent.remote}</span>
                </div>
              )}
              {gptContent.experience && (
                <div className="flex items-center">
                  <DollarSign className="mr-2 text-accent" size={16} />
                  <span>{gptContent.experience}</span>
                </div>
              )}
            </div>
            {gptContent.responsibilities?.length > 0 && (
              <>
                <h4 className="font-bold text-secondary mb-2">
                  Responsibilities
                </h4>
                <ul className="list-disc list-inside mb-4">
                  {gptContent.responsibilities.map((res, index) => (
                    <li key={index} className="text-gray-700">
                      {res}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {gptContent.qualifications?.length > 0 && (
              <>
                <h4 className="font-bold text-secondary mb-2">
                  Qualifications
                </h4>
                <ul className="list-disc list-inside mb-4">
                  {gptContent.qualifications.map((qual, index) => (
                    <li key={index} className="text-gray-700">
                      {qual}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {gptContent.skills?.length > 0 && (
              <>
                <h4 className="font-bold text-secondary mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {gptContent.skills.flatMap((skill) =>
                    (skill.keywords || []).map((keyword, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm"
                      >
                        {keyword}
                      </span>
                    ))
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default JobBoard;
