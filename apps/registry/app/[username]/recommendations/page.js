'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const LoadingAnimation = () => (
  <div className="loading-container">
    <div className="recommendation-loader">
      <div className="resume-card-loader" />
      <div className="job-cards">
        <div className="job-card-loader j1" />
        <div className="job-card-loader j2" />
        <div className="job-card-loader j3" />
      </div>
      <div className="floating-icons">
        <div className="floating-icon i1">💼</div>
        <div className="floating-icon i2">📝</div>
        <div className="floating-icon i3">🎯</div>
      </div>
    </div>
    <div className="loading-text">
      <p className="text-lg">Analyzing job matches...</p>
      <p className="mt-2 text-sm text-gray-500">
        Calculating compatibility scores. This might take a minute.
      </p>
    </div>
  </div>
);

const ScoreDisplay = ({ score, label }) => {
  const circleColor =
    score >= 0.7
      ? 'text-green-500'
      : score >= 0.4
        ? 'text-yellow-500'
        : 'text-red-500';

  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 transform -rotate-90">
          <circle
            className="text-gray-200"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r="30"
            cx="32"
            cy="32"
          />
          <circle
            className={circleColor}
            strokeWidth="4"
            strokeDasharray={188.5}
            strokeDashoffset={188.5 - score * 188.5}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="30"
            cx="32"
            cy="32"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="text-xl font-bold">{Math.round(score * 100)}%</span>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold">{label}</h3>
      </div>
    </div>
  );
};

export default function Recommendations({ params }) {
  const { username } = params;
  const [selectedJob, setSelectedJob] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await axios.get(
          `/api/jobs-graph?username=${username}`,
        );
        const jobsData = response.data.allJobs || [];
        const formattedJobs = jobsData.map((job) => {
          const jobInfo = JSON.parse(job.gpt_content);
          return {
            id: job.uuid,
            title: jobInfo.title,
            company: jobInfo.company,
            type: jobInfo.type,
            remote: jobInfo.remote,
            description: jobInfo.description,
            skills: jobInfo.skills || [],
            qualifications: jobInfo.qualifications || [],
            location: jobInfo.location || {},
          };
        });
        setJobs(formattedJobs);
      } catch (err) {
        console.error('Error loading jobs:', err);
        setError('Failed to load jobs');
      }
    };
    loadJobs();
  }, [username]);

  const handleJobSelect = async (job) => {
    setSelectedJob(job);
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        '/api/recommendations',
        {
          username,
          jobPosting: job,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      if (response.data) {
        setResults({
          overallScore: response.data.score || 0,
          explanation: response.data.explanation || '',
          keyMatches: response.data.keyMatches || [],
          gapsIdentified: response.data.gapsIdentified || [],
          cultureFit: response.data.cultureFit || { score: 0, reasons: [] },
          remoteWorkReadiness: response.data.remoteWorkReadiness || { score: 0, analysis: '' }
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error getting recommendations:', err);
      setError('Failed to analyze job match');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Job Recommendations</h1>

        <p className="text-gray-600 mb-8">
          Select a job posting to analyze how well it matches your resume. Our
          AI-powered recommendation engine will evaluate the match based on
          technical skills, experience, and culture fit.
        </p>

        <div className="flex gap-8">
          {/* Job List */}
          <div className="w-1/3">
            <h2 className="text-xl font-semibold mb-4">Available Positions</h2>
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <div
                  key={index}
                  className={`cursor-pointer rounded-lg border transition-all ${
                    selectedJob === job
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleJobSelect(job)}
                >
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-gray-600">{job.company}</p>
                    <div className="flex gap-2 mt-2">
                      {job.type && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {job.type}
                        </span>
                      )}
                      {job.remote && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          {job.remote}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Results Section */}
          <div className="w-2/3">
            {loading ? (
              <LoadingAnimation />
            ) : error ? (
              <div className="text-red-600 text-lg font-semibold">{error}</div>
            ) : results ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Match Analysis</h2>
                  
                  <ScoreDisplay
                    score={results?.overallScore || 0}
                    label="Overall Match"
                  />
                  
                  <p className="text-gray-600 mb-6">{results?.explanation || ''}</p>
                  
                  {results?.keyMatches?.length > 0 && (
                    <>
                      <hr className="my-6" />
                      <h3 className="text-xl font-semibold mb-4">Key Matches</h3>
                      <ul className="list-disc pl-5 space-y-2 mb-6">
                        {results.keyMatches.map((match, index) => (
                          <li key={index} className="text-gray-600">
                            {match}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {results?.gapsIdentified?.length > 0 && (
                    <>
                      <hr className="my-6" />
                      <h3 className="text-xl font-semibold mb-4">Areas for Growth</h3>
                      <ul className="list-disc pl-5 space-y-2 mb-6">
                        {results.gapsIdentified.map((gap, index) => (
                          <li key={index} className="text-gray-600">
                            {gap}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {results?.cultureFit && (
                    <>
                      <hr className="my-6" />
                      <div className="mb-6">
                        <ScoreDisplay
                          score={results.cultureFit.score || 0}
                          label="Culture Fit"
                        />
                        <h3 className="text-xl font-semibold mb-4">Culture Fit Analysis</h3>
                        <ul className="list-disc pl-5 space-y-2">
                          {results.cultureFit.reasons.map((reason, index) => (
                            <li key={index} className="text-gray-600">
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}

                  {results?.remoteWorkReadiness && (
                    <>
                      <hr className="my-6" />
                      <div className="mb-6">
                        <ScoreDisplay
                          score={results.remoteWorkReadiness.score || 0}
                          label="Remote Work Readiness"
                        />
                        <h3 className="text-xl font-semibold mb-4">Remote Work Analysis</h3>
                        <p className="text-gray-600">
                          {results.remoteWorkReadiness.analysis}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-lg">
                Select a job posting to see how well it matches your resume
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
