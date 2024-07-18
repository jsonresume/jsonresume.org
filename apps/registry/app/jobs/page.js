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

// Assuming you have these colors defined in your Tailwind config
// accent: '#FF6B6B'
// secondary: '#4ECDC4'

const jobData = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  title: 'Web Developer',
  company: 'Microsoft',
  type: 'Full-time',
  date: '2024-07',
  description:
    'We are looking for a skilled Web Developer to join our team. The role involves building and maintaining web applications.',
  location: {
    address: '1234 Glücklichkeit Straße\nHinterhaus 5. Etage li.',
    postalCode: '10115',
    city: 'Berlin',
    countryCode: 'DE',
    region: 'Berlin',
  },
  remote: 'Hybrid',
  salary: '100000',
  experience: 'Mid-level',
  responsibilities: [
    'Develop and maintain web applications',
    'Collaborate with cross-functional teams',
    'Ensure the technical feasibility of UI/UX designs',
    'Optimize applications for maximum speed and scalability',
  ],
  qualifications: [
    "Bachelor's degree in Computer Science or related field",
    '3+ years of experience in web development',
    'Strong understanding of JavaScript, HTML, and CSS',
  ],
  skills: [
    {
      name: 'Web Development',
      level: 'Master',
      keywords: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
    },
    {
      name: 'Database Management',
      level: 'Intermediate',
      keywords: ['SQL', 'NoSQL', 'MongoDB'],
    },
  ],
  meta: {
    canonical: 'http://example.com/jobs/web-developer',
    version: 'v1.0.0',
    lastModified: '2024-07-10T15:00:00',
  },
};

const jobs = [
  { ...jobData, id: 1 },
  {
    ...jobData,
    id: 2,
    title: 'Frontend Developer',
    company: 'Google',
    salary: '120000',
  },
  {
    ...jobData,
    id: 3,
    title: 'Backend Developer',
    company: 'Amazon',
    salary: '130000',
  },
  {
    ...jobData,
    id: 4,
    title: 'Full Stack Developer',
    company: 'Facebook',
    salary: '140000',
  },
  {
    ...jobData,
    id: 5,
    title: 'DevOps Engineer',
    company: 'Netflix',
    salary: '125000',
  },
];

const JobBoard = () => {
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    const results = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedJobType === '' || job.type === selectedJobType) &&
        (selectedExperience === '' || job.experience === selectedExperience)
    );
    setFilteredJobs(results);
  }, [searchTerm, selectedJobType, selectedExperience]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-secondary mb-8 text-center">
        Job Board
      </h1>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center bg-secondary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors duration-200"
          >
            <Filter className="mr-2" size={20} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <AnimatePresence>
            {showFilters && (
              <Filters
                selectedJobType={selectedJobType}
                setSelectedJobType={setSelectedJobType}
                selectedExperience={selectedExperience}
                setSelectedExperience={setSelectedExperience}
              />
            )}
          </AnimatePresence>
          <JobList jobs={filteredJobs} />
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
            {job.title}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <Briefcase className="mr-2" size={16} />
            <span>{job.company}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="mr-2" size={16} />
            <span>
              {job.location.city}, {job.location.region}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-accent font-bold text-xl mb-2">${job.salary}</p>
          <span className="inline-block bg-secondary text-white text-sm px-2 py-1 rounded">
            {job.type}
          </span>
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
            <p className="text-gray-700 mb-4">{job.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <Clock className="mr-2 text-accent" size={16} />
                <span>{job.remote}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-2 text-accent" size={16} />
                <span>{job.experience}</span>
              </div>
            </div>
            <h4 className="font-bold text-secondary mb-2">Responsibilities</h4>
            <ul className="list-disc list-inside mb-4">
              {job.responsibilities.map((res, index) => (
                <li key={index} className="text-gray-700">
                  {res}
                </li>
              ))}
            </ul>
            <h4 className="font-bold text-secondary mb-2">Qualifications</h4>
            <ul className="list-disc list-inside mb-4">
              {job.qualifications.map((qual, index) => (
                <li key={index} className="text-gray-700">
                  {qual}
                </li>
              ))}
            </ul>
            <h4 className="font-bold text-secondary mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {job.skills.flatMap((skill) =>
                skill.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm"
                  >
                    {keyword}
                  </span>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default JobBoard;
