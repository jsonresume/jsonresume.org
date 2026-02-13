import {
  MapPin,
  Building2,
  DollarSign,
  Wifi,
  ExternalLink,
} from 'lucide-react';
import WhyMatch from '../../components/WhyMatch';

function formatSalary(job) {
  if (job.salaryMin && job.salaryMax) {
    return `$${Math.round(job.salaryMin / 1000)}k - $${Math.round(
      job.salaryMax / 1000
    )}k`;
  }
  if (job.salaryUsd) return `$${Math.round(job.salaryUsd / 1000)}k`;
  return null;
}

function formatLocation(job) {
  if (typeof job.location === 'string') return job.location;
  if (job.location?.city && job.location?.region)
    return `${job.location.city}, ${job.location.region}`;
  if (job.location?.city) return job.location.city;
  return null;
}

function SkillBadges({ skills, label, bgClass, textClass }) {
  if (!skills?.length) return null;
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <span
            key={i}
            className={`px-2.5 py-1 ${bgClass} ${textClass} text-sm rounded`}
          >
            {typeof skill === 'string' ? skill : skill?.name || 'Unknown'}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function JobDetailContent({ job }) {
  const salary = formatSalary(job);
  const location = formatLocation(job);

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-1 pr-8">
          {job.title || 'Unknown Position'}
        </h2>
        <div className="flex items-center text-gray-600">
          <Building2 className="w-4 h-4 mr-1.5 flex-shrink-0" />
          <span>{job.company || 'Unknown Company'}</span>
        </div>
      </div>

      {/* Meta badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        {location && (
          <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full">
            <MapPin className="w-4 h-4 mr-1.5" />
            {location}
          </span>
        )}
        {job.remote && (
          <span className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-full">
            <Wifi className="w-4 h-4 mr-1.5" />
            Remote
          </span>
        )}
        {salary && (
          <span className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-full">
            <DollarSign className="w-4 h-4 mr-1.5" />
            {salary}
          </span>
        )}
      </div>

      <SkillBadges
        skills={job.skills}
        label="Skills"
        bgClass="bg-indigo-50"
        textClass="text-indigo-700"
      />
      <SkillBadges
        skills={job.bonusSkills}
        label="Bonus Skills"
        bgClass="bg-gray-100"
        textClass="text-gray-600"
      />

      {/* Description */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          Description
        </h3>
        <p className="text-gray-600 text-sm whitespace-pre-line">
          {job.description || 'No description available.'}
        </p>
      </div>

      <div className="mb-6">
        <WhyMatch job={job} />
      </div>

      {job.url && (
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium mb-6"
        >
          <ExternalLink className="w-4 h-4 mr-1.5" />
          View Original Posting
        </a>
      )}
    </div>
  );
}
