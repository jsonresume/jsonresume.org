'use client';

import { FormSection, FormField, ArrayField } from '../FormComponents';

export function ReferencesSection({ references, handlers }) {
  const { updateArrayItem, addArrayItem, removeArrayItem } = handlers;

  return (
    <FormSection title="References">
      <ArrayField
        items={references || []}
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
  );
}
