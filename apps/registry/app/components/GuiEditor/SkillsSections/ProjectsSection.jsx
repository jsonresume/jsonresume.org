'use client';

import { FormSection, FormField, ArrayField } from '../FormComponents';

export function ProjectsSection({ projects, handlers }) {
  const { updateArrayItem, addArrayItem, removeArrayItem } = handlers;

  return (
    <FormSection title="Projects">
      <ArrayField
        items={projects || []}
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
  );
}
