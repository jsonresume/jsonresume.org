'use client';

import { FormSection, FormField, ArrayField } from './FormComponents';

export const SkillsSection = ({ resume, handlers }) => {
  const { updateArrayItem, addArrayItem, removeArrayItem } = handlers;

  return (
    <>
      <FormSection title="Skills">
        <ArrayField
          items={resume.skills || []}
          onAdd={() =>
            addArrayItem('skills', { name: '', level: '', keywords: [] })
          }
          onRemove={(index) => removeArrayItem('skills', index)}
          addLabel="Add Skill"
          renderItem={(item, index) => (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Name"
                value={item.name}
                onChange={(value) =>
                  updateArrayItem('skills', index, 'name', value)
                }
                placeholder="e.g., Web Development"
              />
              <FormField
                label="Level"
                value={item.level}
                onChange={(value) =>
                  updateArrayItem('skills', index, 'level', value)
                }
                placeholder="e.g., Expert"
              />
            </div>
          )}
        />
      </FormSection>

      <FormSection title="Languages">
        <ArrayField
          items={resume.languages || []}
          onAdd={() => addArrayItem('languages', { language: '', fluency: '' })}
          onRemove={(index) => removeArrayItem('languages', index)}
          addLabel="Add Language"
          renderItem={(item, index) => (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Language"
                value={item.language}
                onChange={(value) =>
                  updateArrayItem('languages', index, 'language', value)
                }
                placeholder="English"
              />
              <FormField
                label="Fluency"
                value={item.fluency}
                onChange={(value) =>
                  updateArrayItem('languages', index, 'fluency', value)
                }
                placeholder="Native Speaker"
              />
            </div>
          )}
        />
      </FormSection>

      <FormSection title="Interests">
        <ArrayField
          items={resume.interests || []}
          onAdd={() => addArrayItem('interests', { name: '', keywords: [] })}
          onRemove={(index) => removeArrayItem('interests', index)}
          addLabel="Add Interest"
          renderItem={(item, index) => (
            <FormField
              label="Name"
              value={item.name}
              onChange={(value) =>
                updateArrayItem('interests', index, 'name', value)
              }
              placeholder="Photography"
            />
          )}
        />
      </FormSection>

      <FormSection title="References">
        <ArrayField
          items={resume.references || []}
          onAdd={() => addArrayItem('references', { name: '', reference: '' })}
          onRemove={(index) => removeArrayItem('references', index)}
          addLabel="Add Reference"
          renderItem={(item, index) => (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Name"
                value={item.name}
                onChange={(value) =>
                  updateArrayItem('references', index, 'name', value)
                }
                placeholder="Jane Doe"
              />
              <FormField
                label="Reference"
                type="textarea"
                value={item.reference}
                onChange={(value) =>
                  updateArrayItem('references', index, 'reference', value)
                }
                placeholder="Reference text..."
              />
            </div>
          )}
        />
      </FormSection>

      <FormSection title="Projects">
        <ArrayField
          items={resume.projects || []}
          onAdd={() =>
            addArrayItem('projects', {
              name: '',
              description: '',
              highlights: [],
              keywords: [],
              startDate: '',
              endDate: '',
              url: '',
            })
          }
          onRemove={(index) => removeArrayItem('projects', index)}
          addLabel="Add Project"
          renderItem={(item, index) => (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Name"
                value={item.name}
                onChange={(value) =>
                  updateArrayItem('projects', index, 'name', value)
                }
                placeholder="Project Name"
              />
              <FormField
                label="URL"
                type="url"
                value={item.url}
                onChange={(value) =>
                  updateArrayItem('projects', index, 'url', value)
                }
                placeholder="https://project.com"
              />
              <FormField
                label="Description"
                type="textarea"
                value={item.description}
                onChange={(value) =>
                  updateArrayItem('projects', index, 'description', value)
                }
                placeholder="Project description..."
              />
            </div>
          )}
        />
      </FormSection>
    </>
  );
};
