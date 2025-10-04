'use client';

import { FormSection, FormField, ArrayField } from '../FormComponents';

export function AwardsSection({ awards, handlers }) {
  const { updateArrayItem, addArrayItem, removeArrayItem } = handlers;

  return (
    <FormSection title="Awards">
      <ArrayField
        items={awards || []}
        onAdd={() =>
          addArrayItem('awards', {
            title: '',
            date: '',
            awarder: '',
            summary: '',
          })
        }
        onRemove={(index) => removeArrayItem('awards', index)}
        addLabel="Add Award"
        renderItem={(item, index) => (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Title"
              value={item.title}
              onChange={(value) =>
                updateArrayItem('awards', index, 'title', value)
              }
              placeholder="Award Title"
            />
            <FormField
              label="Date"
              value={item.date}
              onChange={(value) =>
                updateArrayItem('awards', index, 'date', value)
              }
              placeholder="YYYY-MM-DD"
            />
            <FormField
              label="Awarder"
              value={item.awarder}
              onChange={(value) =>
                updateArrayItem('awards', index, 'awarder', value)
              }
              placeholder="Organization"
            />
            <FormField
              label="Summary"
              type="textarea"
              value={item.summary}
              onChange={(value) =>
                updateArrayItem('awards', index, 'summary', value)
              }
              placeholder="Description..."
            />
          </div>
        )}
      />
    </FormSection>
  );
}
