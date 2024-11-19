'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Filter,
  X,
  Clock,
  Building,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const ClientJobBoard = ({ initialJobs }) => {
  const [jobs] = useState(initialJobs);
  const [filteredJobs, setFilteredJobs] = useState(initialJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    jobType: '',
    experience: '',
    location: '',
    salary: '',
    company: '',
  });

  // Extract unique values for each filter
  const filterOptions = useMemo(() => {
    const options = {
      jobType: new Set(),
      experience: new Set(),
      location: new Set(),
      salary: new Set(),
      company: new Set(),
    };

    jobs.forEach((job) => {
      const gptContent = job.gpt_content && job.gpt_content !== 'FAILED'
        ? JSON.parse(job.gpt_content)
        : {};

      if (gptContent.type) options.jobType.add(gptContent.type);
      if (gptContent.experience) options.experience.add(gptContent.experience);
      if (gptContent.location) {
        const location = [
          gptContent.location.city,
          gptContent.location.region,
          gptContent.location.countryCode,
        ]
          .filter(Boolean)
          .join(', ');
        if (location) options.location.add(location);
      }
      if (gptContent.salary) options.salary.add(gptContent.salary);
      if (gptContent.company) options.company.add(gptContent.company);
    });

    return {
      jobType: Array.from(options.jobType).sort(),
      experience: Array.from(options.experience).sort(),
      location: Array.from(options.location).sort(),
      salary: Array.from(options.salary).sort(),
      company: Array.from(options.company).sort(),
    };
  }, [jobs]);

  useEffect(() => {
    let result = jobs;

    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((job) => {
        const gptContent = job.gpt_content && job.gpt_content !== 'FAILED'
          ? JSON.parse(job.gpt_content)
          : {};
        
        return (
          gptContent.title?.toLowerCase().includes(searchLower) ||
          gptContent.company?.toLowerCase().includes(searchLower) ||
          gptContent.description?.toLowerCase().includes(searchLower) ||
          gptContent.requirements?.some(req => 
            req.toLowerCase().includes(searchLower)
          ) ||
          gptContent.responsibilities?.some(resp => 
            resp.toLowerCase().includes(searchLower)
          )
        );
      });
    }

    // Apply all other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((job) => {
          const gptContent = job.gpt_content && job.gpt_content !== 'FAILED'
            ? JSON.parse(job.gpt_content)
            : {};

          switch (key) {
            case 'jobType':
              return gptContent.type === value;
            case 'experience':
              return gptContent.experience === value;
            case 'location':
              const jobLocation = [
                gptContent.location?.city,
                gptContent.location?.region,
                gptContent.location?.countryCode,
              ]
                .filter(Boolean)
                .join(', ');
              return jobLocation === value;
            case 'salary':
              return gptContent.salary === value;
            case 'company':
              return gptContent.company === value;
            default:
              return true;
          }
        });
      }
    });

    setFilteredJobs(result);
  }, [searchTerm, filters, jobs]);

  const clearFilters = () => {
    setFilters({
      jobType: '',
      experience: '',
      location: '',
      salary: '',
      company: '',
    });
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-80">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="sticky top-4">
          <Filters
            filters={filters}
            setFilters={setFilters}
            filterOptions={filterOptions}
            clearFilters={clearFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
          </p>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              Clear all filters
              <X className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
        <JobList jobs={filteredJobs} />
      </div>
    </div>
  );
};

const SearchBar = ({ searchTerm, setSearchTerm }) => {
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

const FilterSection = ({ title, options, value, onChange, icon: Icon }) => {
  if (!options || options.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center mb-3">
        <Icon className="h-5 w-5 text-gray-500 mr-2" />
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      </div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="">All {title}s</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            title="Clear filter"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

const Filters = ({ filters, setFilters, filterOptions, activeFilterCount }) => {
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        </div>
        {activeFilterCount > 0 && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </div>

      <FilterSection
        title="Job Type"
        options={filterOptions.jobType}
        value={filters.jobType}
        onChange={(value) => updateFilter('jobType', value)}
        icon={Briefcase}
      />

      <FilterSection
        title="Experience"
        options={filterOptions.experience}
        value={filters.experience}
        onChange={(value) => updateFilter('experience', value)}
        icon={Clock}
      />

      <FilterSection
        title="Location"
        options={filterOptions.location}
        value={filters.location}
        onChange={(value) => updateFilter('location', value)}
        icon={MapPin}
      />

      <FilterSection
        title="Salary"
        options={filterOptions.salary}
        value={filters.salary}
        onChange={(value) => updateFilter('salary', value)}
        icon={DollarSign}
      />

      <FilterSection
        title="Company"
        options={filterOptions.company}
        value={filters.company}
        onChange={(value) => updateFilter('company', value)}
        icon={Building}
      />
    </div>
  );
};

const JobList = ({ jobs }) => {
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

  // Use salary string directly to support various formats
  const salary = gptContent.salary || 'Not specified';

  const handleClick = () => {
    router.push(`/jobs/${job.uuid}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={handleClick}
    >
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {gptContent.title || 'Untitled Position'}
          </h3>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            {gptContent.company && (
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-1" />
                {gptContent.company}
              </div>
            )}
            {locationString && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {locationString}
              </div>
            )}
            {salary && (
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                {salary}
              </div>
            )}
            {gptContent.type && (
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-1" />
                {gptContent.type}
              </div>
            )}
          </div>
          {gptContent.description && (
            <p className="text-gray-600 line-clamp-2">
              {gptContent.description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ClientJobBoard;
