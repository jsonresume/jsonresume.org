import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
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

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Enable static page generation with dynamic routes
export async function generateStaticParams() {
  const { data: jobs } = await supabase
    .from('jobs')
    .select('uuid')
    .order('created_at', { ascending: false })
    .limit(1000);

  return jobs?.map((job) => ({
    uuid: job.uuid,
  })) || [];
}

// Add metadata for SEO
export async function generateMetadata({ params }) {
  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('uuid', params.uuid)
    .single();

  if (!job) {
    return {
      title: 'Job Not Found - JSON Resume',
      description: 'The job listing you are looking for could not be found.',
    };
  }

  const gptContent = job.gpt_content && job.gpt_content !== 'FAILED'
    ? JSON.parse(job.gpt_content)
    : {};

  return {
    title: `${gptContent.title || job.title} at ${gptContent.company || 'Company'} - JSON Resume Jobs`,
    description: gptContent.description?.substring(0, 160) || job.description?.substring(0, 160) || 'View this job opportunity on JSON Resume.',
    openGraph: {
      title: `${gptContent.title || job.title} at ${gptContent.company || 'Company'}`,
      description: gptContent.description?.substring(0, 160) || job.description?.substring(0, 160) || 'View this job opportunity on JSON Resume.',
    },
  };
}

export default async function JobPage({ params }) {
  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('uuid', params.uuid)
    .single();

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
          <Link
            href="/jobs"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Jobs
          </Link>
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
  const postedDate = new Date(job.created_at);
  const timeAgo = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const daysAgo = Math.ceil(
    (postedDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const postedAgo = timeAgo.format(daysAgo, 'day');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {gptContent.title || job.title}
                </h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <Building className="mr-2 h-5 w-5" />
                  <span className="font-medium">{gptContent.company}</span>
                </div>
                {locationString && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="mr-2 h-5 w-5" />
                    <span>{locationString}</span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 mb-2">{salary}</div>
                {gptContent.type && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {gptContent.type}
                  </span>
                )}
              </div>
            </div>

            {/* Meta Information */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="mr-2 h-5 w-5" />
                <span>Posted {postedAgo}</span>
              </div>
              {gptContent.experience && (
                <div className="flex items-center text-gray-600">
                  <Clock className="mr-2 h-5 w-5" />
                  <span>{gptContent.experience}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {gptContent.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Description
                </h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {gptContent.description}
                </p>
              </div>
            )}

            {/* Responsibilities */}
            {gptContent.responsibilities?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Responsibilities
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  {gptContent.responsibilities.map((responsibility, index) => (
                    <li key={index} className="text-gray-700">
                      {responsibility}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Qualifications */}
            {gptContent.qualifications?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Qualifications
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  {gptContent.qualifications.map((qualification, index) => (
                    <li key={index} className="text-gray-700">
                      {qualification}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {gptContent.skills?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {gptContent.skills.flatMap((skill) =>
                    (skill.keywords || []).map((keyword, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                      >
                        {keyword}
                      </span>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Navigation and Apply */}
            <div className="mt-8 flex justify-between items-center">
              <Link
                href="/jobs"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Jobs
              </Link>
              {job.apply_url && (
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Apply Now
                  <CheckCircle className="ml-2 h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
