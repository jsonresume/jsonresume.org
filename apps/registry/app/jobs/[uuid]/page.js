'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Building,
  Calendar,
  DollarSign,
  BriefcaseIcon,
  Globe,
  CheckCircle,
  ArrowLeft,
  Clock,
} from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function JobPage({ params }) {
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`/api/jobs/${params.uuid}`);
        if (response.data) {
          console.log('Job data:', response.data); // Add logging
          setJob(response.data);
        }
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Job Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push('/jobs')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

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

  // Format posted date
  const postedDate = job.created_at
    ? new Date(job.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => router.push('/jobs')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Jobs
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {gptContent.title || 'Untitled Position'}
                </h1>
                <div className="flex items-center text-gray-600">
                  <Building className="mr-2 h-5 w-5" />
                  <span className="font-medium">
                    {gptContent.company || 'Company not specified'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {gptContent.type || 'Full-time'}
                </span>
                {gptContent.remote && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Remote
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b border-gray-100">
            {locationString && (
              <div className="flex items-center text-gray-600">
                <MapPin className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Location</div>
                  <div className="text-gray-900">{locationString}</div>
                </div>
              </div>
            )}
            <div className="flex items-center text-gray-600">
              <DollarSign className="mr-3 h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-500">Salary</div>
                <div className="text-gray-900">{salary}</div>
              </div>
            </div>
            {gptContent.experience && (
              <div className="flex items-center text-gray-600">
                <BriefcaseIcon className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Experience
                  </div>
                  <div className="text-gray-900">{gptContent.experience}</div>
                </div>
              </div>
            )}
            <div className="flex items-center text-gray-600">
              <Clock className="mr-3 h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-500">
                  Posted Date
                </div>
                <div className="text-gray-900">{postedDate}</div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="p-6 space-y-8">
            {/* Apply Button */}
            {job.url && (
              <div className="flex justify-center mb-8">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <BriefcaseIcon className="mr-2 h-5 w-5" />
                  Apply Now
                </a>
              </div>
            )}

            {/* Description */}
            {gptContent.description && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Description
                </h2>
                <div className="prose max-w-none text-gray-600">
                  <p className="whitespace-pre-wrap">{gptContent.description}</p>
                </div>
              </section>
            )}

            {/* Responsibilities */}
            {gptContent.responsibilities?.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Responsibilities
                </h2>
                <ul className="space-y-3">
                  {gptContent.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Qualifications */}
            {gptContent.qualifications?.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Qualifications
                </h2>
                <ul className="space-y-3">
                  {gptContent.qualifications.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Skills */}
            {gptContent.skills?.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Required Skills
                </h2>
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
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
