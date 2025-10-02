'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@repo/ui';
import { FormSection, FormField, ArrayField } from './FormComponents';

export const WorkSection = ({ resume, handlers }) => {
  const {
    updateWorkExperience,
    addWorkExperience,
    removeWorkExperience,
    addHighlight,
    updateHighlight,
    removeHighlight,
  } = handlers;

  return (
    <FormSection title="Work Experience">
      <ArrayField
        items={resume.work || []}
        onAdd={addWorkExperience}
        onRemove={removeWorkExperience}
        addLabel="Add Work Experience"
        renderItem={(item, index) => (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Company Name"
                value={item.name}
                onChange={(value) => updateWorkExperience(index, 'name', value)}
                placeholder="Company Name"
              />
              <FormField
                label="Position"
                value={item.position}
                onChange={(value) =>
                  updateWorkExperience(index, 'position', value)
                }
                placeholder="Job Title"
              />
              <FormField
                label="Start Date"
                value={item.startDate}
                onChange={(value) =>
                  updateWorkExperience(index, 'startDate', value)
                }
                placeholder="YYYY-MM"
              />
              <FormField
                label="End Date"
                value={item.endDate}
                onChange={(value) =>
                  updateWorkExperience(index, 'endDate', value)
                }
                placeholder="YYYY-MM or Present"
              />
              <FormField
                label="Location"
                value={item.location}
                onChange={(value) =>
                  updateWorkExperience(index, 'location', value)
                }
                placeholder="City, Country"
              />
              <FormField
                label="Website"
                type="url"
                value={item.url}
                onChange={(value) => updateWorkExperience(index, 'url', value)}
                placeholder="https://company.com"
              />
            </div>
            <FormField
              label="Summary"
              type="textarea"
              value={item.summary}
              onChange={(value) =>
                updateWorkExperience(index, 'summary', value)
              }
              placeholder="Brief summary of your role..."
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Highlights
              </label>
              {(item.highlights || []).map((highlight, hIndex) => (
                <div key={hIndex} className="flex gap-2">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) =>
                      updateHighlight(index, hIndex, e.target.value)
                    }
                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Achievement or responsibility..."
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeHighlight(index, hIndex)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addHighlight(index)}
                className="w-full flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Highlight
              </Button>
            </div>
          </div>
        )}
      />
    </FormSection>
  );
};
