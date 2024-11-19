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
                <h1 className="text-3xl font-bold mb-2">{gptContent.title || 'Untitled Position'}</h1>
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
              <div
                dangerouslySetInnerHTML={{
                  __html: gptContent.description.replace(/\n/g, '<br />'),
                }}
              />
            </div>

            {gptContent.requirements && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {gptContent.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <a
                href={`mailto:${job.contact_email}?subject=Application for ${gptContent.title} position`}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Apply for this position
              </a>
            </div>
          </div>

          {/* Add the matching candidates section */}
          <MatchingCandidates jobId={params.uuid} />
        </motion.div>
      </div>
    </div>
  );
}
