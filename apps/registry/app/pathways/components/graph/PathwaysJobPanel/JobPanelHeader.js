import { useState } from 'react';
import { Badge } from '@repo/ui';
import {
  ExternalLink,
  Check,
  Briefcase,
  Clock,
  Globe,
  X,
  Link2,
  Building2,
} from 'lucide-react';
import { highlightText } from './highlightText';

export function JobPanelHeader({
  jobInfo,
  filterText,
  hnUrl,
  companyUrl,
  onClose,
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="p-4 border-b bg-gradient-to-r from-indigo-50 to-white">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">
            {highlightText(jobInfo.title, filterText)}
          </h3>
          {companyUrl ? (
            <a
              href={
                companyUrl.startsWith('http')
                  ? companyUrl
                  : `https://${companyUrl}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <Building2 className="w-3 h-3" />
              {highlightText(jobInfo.company, filterText)}
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <p className="text-sm text-gray-600">
              {highlightText(jobInfo.company, filterText)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(hnUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="Copy link"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Link2 className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        {jobInfo.salary && (
          <Badge className="bg-green-100 text-green-700 border-0">
            {jobInfo.salary}
          </Badge>
        )}
        {jobInfo.type && (
          <Badge variant="secondary" className="gap-1">
            <Briefcase className="w-3 h-3" />
            {jobInfo.type}
          </Badge>
        )}
        {jobInfo.experience && (
          <Badge variant="secondary" className="gap-1">
            <Clock className="w-3 h-3" />
            {jobInfo.experience}
          </Badge>
        )}
        {jobInfo.remote && (
          <Badge variant="secondary" className="gap-1 text-blue-600">
            <Globe className="w-3 h-3" />
            Remote
          </Badge>
        )}
      </div>
    </div>
  );
}
