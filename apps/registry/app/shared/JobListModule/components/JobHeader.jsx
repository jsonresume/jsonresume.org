import {
  Building,
  DollarSign,
  MapPin,
  BriefcaseIcon,
  Globe,
  Calendar,
} from 'lucide-react';

export function JobHeader({ job }) {
  return (
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
          <DollarSign className="w-5 h-5 mr-2 text-warning-500" />
          <span>
            {job.salary
              ? `$${Number(job.salary).toLocaleString()}/year`
              : 'Not available'}
          </span>
        </div>
        <div className="flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-secondary-500" />
          <span>
            {job.location
              ? `${job.location.city}, ${job.location.countryCode}`
              : 'Not available'}
          </span>
        </div>
        <div className="flex items-center">
          <BriefcaseIcon className="w-5 h-5 mr-2 text-accent-500" />
          <span>{job.experience || 'Not available'}</span>
        </div>
        <div className="flex items-center">
          <Globe className="w-5 h-5 mr-2 text-accent-500" />
          <span>Remote - {job.remote || 'Not available'}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-success-500" />
          <span>{job.date || 'Not available'}</span>
        </div>
      </div>
    </header>
  );
}
