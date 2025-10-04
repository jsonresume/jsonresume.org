'use client';

import { FormSection, FormField, ArrayField } from '../FormComponents';

export const VolunteerSection = ({ resume, handlers }) => {
  const { updateArrayItem, addArrayItem, removeArrayItem } = handlers;

  return (
    <FormSection title="Volunteer Experience">
      <ArrayField
        items={resume.volunteer || []}
        onAdd={() =>
          addArrayItem('volunteer', {
            organization: '',
            position: '',
            url: '',
            startDate: '',
            endDate: '',
            summary: '',
            highlights: [],
          })
        }
        onRemove={(index) => removeArrayItem('volunteer', index)}
        addLabel="Add Volunteer Experience"
        renderItem={(item, index) => (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Organization"
              value={item.organization}
              onChange={(value) =>
                updateArrayItem('volunteer', index, 'organization', value)
              }
              placeholder="Organization Name"
            />
            <FormField
              label="Position"
              value={item.position}
              onChange={(value) =>
                updateArrayItem('volunteer', index, 'position', value)
              }
              placeholder="Volunteer Role"
            />
          </div>
        )}
      />
    </FormSection>
  );
};
