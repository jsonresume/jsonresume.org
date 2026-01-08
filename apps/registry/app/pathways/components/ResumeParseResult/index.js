'use client';

import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import SectionItem from './SectionItem';
import { sortSections, hasValidData } from './sectionUtils';

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
    const filteredData = {};
    for (const section of selectedSections) {
      if (parsedData[section]) {
        filteredData[section] = parsedData[section];
      }
    }
    onApplyChanges(filteredData);
  };

  const availableSections = sortSections(
    Object.entries(parsedData).filter(([, data]) => hasValidData(data))
  );

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
          {availableSections.map(([section, data]) => (
            <SectionItem
              key={section}
              section={section}
              data={data}
              isSelected={selectedSections.has(section)}
              isExpanded={expandedSections.has(section)}
              isApplying={isApplying}
              onToggleSelected={toggleSection}
              onToggleExpanded={toggleExpanded}
            />
          ))}
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
