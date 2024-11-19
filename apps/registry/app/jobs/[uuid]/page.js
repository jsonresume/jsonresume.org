'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Building,
  DollarSign,
  BriefcaseIcon,
  CheckCircle,
  ArrowLeft,
  Clock,
} from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import MatchingCandidates from '../components/MatchingCandidates';

export default function JobPage({ params }) {
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`/api/jobs/${params.uuid}`);
        setJob(data);
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.uuid) {
      fetchJob();
    }
  }, [params.uuid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Job not found</h1>
          <p className="text-gray-600 mb-8">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push('/jobs')}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }
    return 'Just now';
  };

  const gptContent =
    job.gpt_content && job.gpt_content !== 'FAILED'
      ? JSON.parse(job.gpt_content)
      : {};

  // Extract and format location
  const location = gptContent.location || {};
  const locationString = [location.city, location.region, location.countryCode]
    .filter(Boolean)
    .join(', ');

  // Use salary string directly
  const salary = gptContent.salary || 'Not specified';

  // Format posted date
  const postedDate = job.created_at
    ? new Date(job.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => router.push('/jobs')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </button>

          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {gptContent.title || 'Untitled Position'}
                </h1>
                <div className="flex items-center text-gray-600 space-x-4">
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-2" />
                    {gptContent.company || 'Company not specified'}
                  </div>
                  {locationString && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {locationString}
                    </div>
                  )}
                  {salary && (
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      {salary}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-gray-500 flex items-center mb-2">
                  <Clock className="w-4 h-4 mr-1" />
                  {postedDate}
                </span>
                {gptContent.type && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                    <BriefcaseIcon className="w-4 h-4 mr-1" />
                    {gptContent.type}
                  </span>
                )}
              </div>
            </div>

            <div className="prose max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                  {/* Description Section */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">About This Role</h2>
                    <div
                      className="text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html: gptContent.description.replace(/\n/g, '<br />'),
                      }}
                    />
                  </div>

                  {/* Requirements Section */}
                  {gptContent.requirements && gptContent.requirements.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                      <ul className="space-y-2">
                        {gptContent.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Skills Section */}
                  {gptContent.skills && gptContent.skills.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
                      <div className="space-y-4">
                        {gptContent.skills.map((skillGroup, index) => (
                          <div key={index}>
                            {skillGroup.name && (
                              <h3 className="font-medium text-gray-700 mb-2">
                                {skillGroup.name}
                              </h3>
                            )}
                            <div className="flex flex-wrap gap-2">
                              {(skillGroup.keywords || []).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Benefits Section */}
                  {gptContent.benefits && gptContent.benefits.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Benefits & Perks</h2>
                      <ul className="space-y-2">
                        {gptContent.benefits.map((benefit, index) => (
                          <li
                            key={index}
                            className="flex items-center bg-gray-50 rounded-lg p-3"
                          >
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-600">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {/* Responsibilities Section */}
                  {gptContent.responsibilities && gptContent.responsibilities.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Key Responsibilities</h2>
                      <ul className="space-y-2">
                        {gptContent.responsibilities.map((resp, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Experience Section */}
                  {gptContent.experience && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Experience Level</h2>
                      <p className="text-gray-600">{gptContent.experience}</p>
                    </div>
                  )}

                  {/* Company Culture Section */}
                  {gptContent.culture && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Company Culture</h2>
                      <p className="text-gray-600">{gptContent.culture}</p>
                    </div>
                  )}

                  {/* Additional Information */}
                  {gptContent.additional && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
                      <p className="text-gray-600">{gptContent.additional}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Apply Section */}
            <div className="mt-12 flex flex-col items-center border-t pt-8">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">Interested in this position?</h2>
                <p className="text-gray-600">
                  We'd love to hear from you! Click below to apply.
                </p>
              </div>
              {job.url ? (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Apply on Company Website
                </a>
              ) : (
                <a
                  href={`mailto:${job.contact_email}?subject=Application for ${
                    gptContent.title || 'Position'
                  }`}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Apply via Email
                </a>
              )}
            </div>
          </div>

          {/* Add the matching candidates section */}
          <MatchingCandidates jobId={params.uuid} />
        </motion.div>
      </div>
    </div>
  );
}
