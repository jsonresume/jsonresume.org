'use client';

import { Check, Eye, EyeOff } from 'lucide-react';
import { renderSectionDetails } from './SectionRenderers';
import { getSectionIcon, formatSectionPreview } from './sectionUtils';

/**
 * Single section item in the parse result list
 */
export default function SectionItem({
  section,
  data,
  isSelected,
  isExpanded,
  isApplying,
  onToggleSelected,
  onToggleExpanded,
}) {
  const IconComponent = getSectionIcon(section);

  return (
    <div className="border rounded-md">
      <div className="flex items-center p-3">
        <button
          onClick={() => onToggleSelected(section)}
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
          <div className="font-medium text-sm capitalize">{section}</div>
          <div className="text-xs text-gray-500">
            {formatSectionPreview(section, data)}
          </div>
        </div>

        <button
          onClick={() => onToggleExpanded(section)}
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
}
