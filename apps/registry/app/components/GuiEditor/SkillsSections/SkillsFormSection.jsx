'use client';

import { FormSection, FormField, ArrayField } from '../FormComponents';

export function SkillsFormSection({ skills, handlers }) {
  const { updateArrayItem, addArrayItem, removeArrayItem } = handlers;

  return (
    <FormSection title="Skills">
      <ArrayField
        items={skills || []}
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
  );
}
