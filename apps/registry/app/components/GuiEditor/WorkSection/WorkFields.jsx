'use client';

import { FormField } from '../FormComponents';

export const WorkFields = ({ item, index, updateWorkExperience }) => {
  return (
    <>
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
          onChange={(value) => updateWorkExperience(index, 'position', value)}
          placeholder="Job Title"
        />
        <FormField
          label="Start Date"
          value={item.startDate}
          onChange={(value) => updateWorkExperience(index, 'startDate', value)}
          placeholder="YYYY-MM"
        />
        <FormField
          label="End Date"
          value={item.endDate}
          onChange={(value) => updateWorkExperience(index, 'endDate', value)}
          placeholder="YYYY-MM or Present"
        />
        <FormField
          label="Location"
          value={item.location}
          onChange={(value) => updateWorkExperience(index, 'location', value)}
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
        onChange={(value) => updateWorkExperience(index, 'summary', value)}
        placeholder="Brief summary of your role..."
      />
    </>
  );
};
