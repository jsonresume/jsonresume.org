'use client';

import { FormSection, FormField, ArrayField } from './FormComponents';

export const EducationSection = ({ resume, handlers }) => {
  const { updateArrayItem, addArrayItem, removeArrayItem } = handlers;

  return (
    <>
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

      <FormSection title="Education">
        <ArrayField
          items={resume.education || []}
          onAdd={() =>
            addArrayItem('education', {
              institution: '',
              area: '',
              studyType: '',
              startDate: '',
              endDate: '',
              score: '',
            })
          }
          onRemove={(index) => removeArrayItem('education', index)}
          addLabel="Add Education"
          renderItem={(item, index) => (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Institution"
                value={item.institution}
                onChange={(value) =>
                  updateArrayItem('education', index, 'institution', value)
                }
                placeholder="University Name"
              />
              <FormField
                label="Area of Study"
                value={item.area}
                onChange={(value) =>
                  updateArrayItem('education', index, 'area', value)
                }
                placeholder="Computer Science"
              />
              <FormField
                label="Study Type"
                value={item.studyType}
                onChange={(value) =>
                  updateArrayItem('education', index, 'studyType', value)
                }
                placeholder="Bachelor's"
              />
              <FormField
                label="Score/GPA"
                value={item.score}
                onChange={(value) =>
                  updateArrayItem('education', index, 'score', value)
                }
                placeholder="3.8"
              />
            </div>
          )}
        />
      </FormSection>
    </>
  );
};
