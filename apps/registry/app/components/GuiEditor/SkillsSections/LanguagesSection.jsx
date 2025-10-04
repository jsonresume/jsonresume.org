'use client';

import { FormSection, FormField, ArrayField } from '../FormComponents';

export function LanguagesSection({ languages, handlers }) {
  const { updateArrayItem, addArrayItem, removeArrayItem } = handlers;

  return (
    <FormSection title="Languages">
      <ArrayField
        items={languages || []}
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
  );
}
