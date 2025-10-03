import { useRouter } from 'next/navigation';
import { Building, MapPin, Briefcase, DollarSign } from 'lucide-react';
import { categorizeJobType } from '../utils/categorization';
import { parseJobContent, getLocationString } from '../utils/jobParser';

export const JobItem = ({ job }) => {
  const router = useRouter();
  const gptContent = parseJobContent(job);

  const locationString = getLocationString(gptContent);
  const salary = gptContent.salary || 'Not specified';

  const handleClick = () => {
    router.push(`/jobs/${job.uuid}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={handleClick}
    >
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {gptContent.title || 'Position Not Specified'}
          </h2>
          <div className="text-sm text-gray-500 space-y-2">
            <div className="flex items-center">
              <Building className="w-4 h-4 mr-2" />
              <span>{gptContent.company || 'Company Not Specified'}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{locationString || 'Location Not Specified'}</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 mr-2" />
              <span>
                {categorizeJobType(gptContent.type) || 'Type Not Specified'}
              </span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              <span>{salary}</span>
            </div>
          </div>
          {gptContent.description && (
            <p className="mt-4 text-gray-600 line-clamp-3">
              {gptContent.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
