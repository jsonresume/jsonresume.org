'use client';

import { FormSection, FormField, ArrayField } from '../FormComponents';

export function InterestsSection({ interests, handlers }) {
  const { updateArrayItem, addArrayItem, removeArrayItem } = handlers;

  return (
    <FormSection title="Interests">
      <ArrayField
        items={interests || []}
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
  );
}
