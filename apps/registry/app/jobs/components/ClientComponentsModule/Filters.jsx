'use client';

import { Filter } from 'lucide-react';
import { Button } from '@repo/ui';
import { JOB_TYPES, EXPERIENCE_LEVELS } from './filterOptions';

export function Filters({
  selectedJobType,
  setSelectedJobType,
  selectedExperience,
  setSelectedExperience,
}) {
  return (
    <div className="w-64 space-y-6">
      <div>
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Job Type</h3>
            <div className="space-y-2">
              {JOB_TYPES.map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="radio"
                    name="jobType"
                    value={type}
                    checked={selectedJobType === type}
                    onChange={(e) => setSelectedJobType(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">{type}</span>
                </label>
              ))}
              {selectedJobType && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setSelectedJobType('')}
                  className="mt-1 h-auto p-0"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Experience
            </h3>
            <div className="space-y-2">
              {EXPERIENCE_LEVELS.map((level) => (
                <label key={level} className="flex items-center">
                  <input
                    type="radio"
                    name="experience"
                    value={level}
                    checked={selectedExperience === level}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">{level}</span>
                </label>
              ))}
              {selectedExperience && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setSelectedExperience('')}
                  className="mt-1 h-auto p-0"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
