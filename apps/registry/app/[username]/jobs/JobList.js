import React, { useState } from 'react';
import {
  MapPin,
  Building,
  Calendar,
  DollarSign,
  BriefcaseIcon,
  CheckCircle,
  Star,
} from 'lucide-react';

const JobDescription = ({ job, makeCoverletter }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="p-6 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105 cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          {job.title || 'Not available'}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 mt-2">
          <div className="flex items-center">
            <Building className="w-5 h-5 mr-2" />
            <span>{job.company || 'Not available'}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-yellow-500" />
            <span>
              {job.salary
                ? `$${Number(job.salary).toLocaleString()}/year`
                : 'Not available'}
            </span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-500" />
            <span>
              {job.location
                ? `${job.location.city}, ${job.location.countryCode}`
                : 'Not available'}
            </span>
          </div>
          <div className="flex items-center">
            <BriefcaseIcon className="w-5 h-5 mr-2 text-purple-500" />
            <span>{job.experience || 'Not available'}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-500" />
            <span>{job.date || 'Not available'}</span>
          </div>
          <div className="text-gray-600 col-span-full">
            {expanded ? (
              <p>{job.description || 'Not available'}</p>
            ) : (
              <p>
                {job.description
                  ? job.description.slice(0, 100) + '...'
                  : 'Not available'}
              </p>
            )}
          </div>
        </div>
      </header>
      {expanded && (
        <div className="mt-4">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              Responsibilities
            </h2>
            <ul className="list-none">
              {job.responsibilities?.length ? (
                job.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start mb-2">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-1" />
                    <span>{resp}</span>
                  </li>
                ))
              ) : (
                <p>Not available</p>
              )}
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              Qualifications
            </h2>
            <ul className="list-none">
              {job.qualifications?.length ? (
                job.qualifications.map((qual, index) => (
                  <li key={index} className="flex items-start mb-2">
                    <CheckCircle className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-1" />
                    <span>{qual}</span>
                  </li>
                ))
              ) : (
                <p>Not available</p>
              )}
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              Skills
            </h2>
            {job.skills?.length ? (
              job.skills.map((skill, index) => (
                <div key={index} className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-700">
                    {skill.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    <span>{skill.level}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skill.keywords?.length ? (
                      skill.keywords.map((keyword, kidx) => (
                        <span
                          key={kidx}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ))
                    ) : (
                      <p>Not available</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>Not available</p>
            )}
          </div>
          <div className="mt-4 flex gap-4">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              onClick={() => makeCoverletter(job.raw)}
            >
              Make Cover Letter
            </button>
            <a
              href={job.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
            >
              View Original Job
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

const JobList = ({ jobs, makeCoverletter }) => {
  const fullJobs = jobs?.map((job) => {
    const fullJob = JSON.parse(job.gpt_content);
    fullJob.raw = job;
    return fullJob;
  });

  return (
    <div className="flex flex-col gap-5">
      {fullJobs?.map((job, index) => (
        <JobDescription
          key={index}
          job={job}
          makeCoverletter={makeCoverletter}
        />
      ))}
    </div>
  );
};

export default JobList;
