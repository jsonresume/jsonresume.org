import {
  MapPin,
  Building,
  DollarSign,
  BriefcaseIcon,
  Clock,
} from 'lucide-react';

export const JobHeader = ({
  title,
  company,
  locationString,
  salary,
  postedDate,
  jobType,
}) => {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {title || 'Untitled Position'}
        </h1>
        <div className="flex items-center text-gray-600 space-x-4">
          <div className="flex items-center">
            <Building className="w-4 h-4 mr-2" />
            {company || 'Company not specified'}
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
        {jobType && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
            <BriefcaseIcon className="w-4 h-4 mr-1" />
            {jobType}
          </span>
        )}
      </div>
    </div>
  );
};
