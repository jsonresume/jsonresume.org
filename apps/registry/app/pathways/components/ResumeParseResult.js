'use client';

import { useState } from 'react';
import {
  Check,
  X,
  Eye,
  EyeOff,
  Upload,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Calendar,
  MapPin,
} from 'lucide-react';

export default function ResumeParseResult({
  parsedData,
  onApplyChanges,
  onDismiss,
  isApplying = false,
}) {
  const [selectedSections, setSelectedSections] = useState(
    new Set(['basics', 'work', 'education', 'skills'])
  );
  const [expandedSections, setExpandedSections] = useState(new Set(['basics']));

  const toggleSection = (section) => {
    const newSelected = new Set(selectedSections);
    if (newSelected.has(section)) {
      newSelected.delete(section);
    } else {
      newSelected.add(section);
    }
    setSelectedSections(newSelected);
  };

  const toggleExpanded = (section) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleApply = () => {
    // Only include selected sections
    const filteredData = {};
    for (const section of selectedSections) {
      if (parsedData[section]) {
        filteredData[section] = parsedData[section];
      }
    }
    onApplyChanges(filteredData);
  };

  const getSectionIcon = (section) => {
    switch (section) {
      case 'basics':
        return User;
      case 'work':
        return Briefcase;
      case 'education':
        return GraduationCap;
      case 'skills':
        return Code;
      case 'awards':
        return Award;
      case 'projects':
        return Upload;
      default:
        return Calendar;
    }
  };

  const formatSectionPreview = (section, data) => {
    switch (section) {
      case 'basics':
        return `${data.name || 'Name'} • ${data.email || 'Email'} • ${
          data.phone || 'Phone'
        }`;
      case 'work':
        return `${data.length} position${data.length !== 1 ? 's' : ''} at ${data
          .slice(0, 2)
          .map((job) => job.name)
          .join(', ')}${data.length > 2 ? '...' : ''}`;
      case 'education':
        return `${data.length} degree${data.length !== 1 ? 's' : ''} from ${data
          .slice(0, 2)
          .map((edu) => edu.institution)
          .join(', ')}${data.length > 2 ? '...' : ''}`;
      case 'skills':
        return `${data.length} skill${data.length !== 1 ? 's' : ''}: ${data
          .slice(0, 3)
          .map((skill) => skill.name)
          .join(', ')}${data.length > 3 ? '...' : ''}`;
      case 'awards':
        return `${data.length} award${data.length !== 1 ? 's' : ''}: ${data
          .slice(0, 2)
          .map((award) => award.title)
          .join(', ')}${data.length > 2 ? '...' : ''}`;
      case 'projects':
        return `${data.length} project${data.length !== 1 ? 's' : ''}: ${data
          .slice(0, 2)
          .map((proj) => proj.name)
          .join(', ')}${data.length > 2 ? '...' : ''}`;
      default:
        return `${data.length || 0} item${data.length !== 1 ? 's' : ''}`;
    }
  };

  const renderSectionDetails = (section, data) => {
    switch (section) {
      case 'basics':
        return (
          <div className="space-y-2">
            {data.name && (
              <div>
                <strong>Name:</strong> {data.name}
              </div>
            )}
            {data.label && (
              <div>
                <strong>Title:</strong> {data.label}
              </div>
            )}
            {data.email && (
              <div>
                <strong>Email:</strong> {data.email}
              </div>
            )}
            {data.phone && (
              <div>
                <strong>Phone:</strong> {data.phone}
              </div>
            )}
            {data.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {data.location.city && data.location.region
                  ? `${data.location.city}, ${data.location.region}`
                  : data.location.city || data.location.region}
              </div>
            )}
            {data.summary && (
              <div className="mt-2">
                <strong>Summary:</strong>
                <p className="text-sm text-gray-600 mt-1">{data.summary}</p>
              </div>
            )}
          </div>
        );

      case 'work':
        return (
          <div className="space-y-3">
            {data.map((job, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-3">
                <div className="font-medium">{job.position}</div>
                <div className="text-sm text-gray-600">{job.name}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {job.startDate} {job.endDate && `- ${job.endDate}`}
                </div>
                {job.highlights && job.highlights.length > 0 && (
                  <ul className="text-xs text-gray-600 mt-1 list-disc list-inside">
                    {job.highlights.slice(0, 2).map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                    {job.highlights.length > 2 && (
                      <li className="text-gray-400">
                        +{job.highlights.length - 2} more...
                      </li>
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );

      case 'education':
        return (
          <div className="space-y-2">
            {data.map((edu, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-3">
                <div className="font-medium">
                  {edu.studyType} {edu.area && `in ${edu.area}`}
                </div>
                <div className="text-sm text-gray-600">{edu.institution}</div>
                {(edu.startDate || edu.endDate) && (
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {edu.startDate} {edu.endDate && `- ${edu.endDate}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-2">
            {data.map((skill, index) => (
              <div key={index} className="flex items-start gap-2">
                <Code className="w-3 h-3 mt-0.5 text-gray-400" />
                <div>
                  <div className="font-medium text-sm">{skill.name}</div>
                  {skill.keywords && skill.keywords.length > 0 && (
                    <div className="text-xs text-gray-500 flex flex-wrap gap-1 mt-1">
                      {skill.keywords.slice(0, 5).map((keyword, i) => (
                        <span key={i} className="bg-gray-100 px-1 rounded">
                          {keyword}
                        </span>
                      ))}
                      {skill.keywords.length > 5 && (
                        <span className="text-gray-400">
                          +{skill.keywords.length - 5}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="text-sm text-gray-600">
            {JSON.stringify(data, null, 2)}
          </div>
        );
    }
  };

  const availableSections = Object.entries(parsedData)
    .filter(
      ([, data]) =>
        data &&
        (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)
    )
    .sort(([a], [b]) => {
      const order = [
        'basics',
        'work',
        'education',
        'skills',
        'awards',
        'projects',
      ];
      return order.indexOf(a) - order.indexOf(b);
    });

  return (
    <div className="bg-white border rounded-lg shadow-sm mx-4 mb-4">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-green-600" />
          <h3 className="font-medium text-gray-900">
            Resume Parsed Successfully
          </h3>
        </div>
        <button
          onClick={onDismiss}
          disabled={isApplying}
          className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-600 mb-4">
          Select which sections to apply to your resume. You can expand each
          section to review the details.
        </p>

        <div className="space-y-3 mb-4">
          {availableSections.map(([section, data]) => {
            const IconComponent = getSectionIcon(section);
            const isSelected = selectedSections.has(section);
            const isExpanded = expandedSections.has(section);

            return (
              <div key={section} className="border rounded-md">
                <div className="flex items-center p-3">
                  <button
                    onClick={() => toggleSection(section)}
                    className={`flex items-center justify-center w-5 h-5 rounded border-2 mr-3 transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'border-gray-300 hover:border-indigo-400'
                    }`}
                    disabled={isApplying}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </button>

                  <IconComponent
                    className={`w-4 h-4 mr-2 ${
                      isSelected ? 'text-indigo-600' : 'text-gray-400'
                    }`}
                  />

                  <div className="flex-1">
                    <div className="font-medium text-sm capitalize">
                      {section}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatSectionPreview(section, data)}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpanded(section)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    disabled={isApplying}
                  >
                    {isExpanded ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <div className="px-3 pb-3 border-t bg-gray-50">
                    <div className="pt-3 max-h-48 overflow-y-auto">
                      {renderSectionDetails(section, data)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <button
            onClick={handleApply}
            disabled={selectedSections.size === 0 || isApplying}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isApplying
              ? 'Applying Changes...'
              : `Apply ${selectedSections.size} Section${
                  selectedSections.size !== 1 ? 's' : ''
                }`}
          </button>
          <button
            onClick={onDismiss}
            disabled={isApplying}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
