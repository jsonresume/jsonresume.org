'use client';

import { FormSection, FormField, ArrayField } from '../FormComponents';

export function PublicationsSection({ publications, handlers }) {
  const { updateArrayItem, addArrayItem, removeArrayItem } = handlers;

  return (
    <FormSection title="Publications">
      <ArrayField
        items={publications || []}
        onAdd={() =>
          addArrayItem('publications', {
            name: '',
            publisher: '',
            releaseDate: '',
            url: '',
            summary: '',
          })
        }
        onRemove={(index) => removeArrayItem('publications', index)}
        addLabel="Add Publication"
        renderItem={(item, index) => (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Name"
              value={item.name}
              onChange={(value) =>
                updateArrayItem('publications', index, 'name', value)
              }
              placeholder="Publication Title"
            />
            <FormField
              label="Publisher"
              value={item.publisher}
              onChange={(value) =>
                updateArrayItem('publications', index, 'publisher', value)
              }
              placeholder="Publisher Name"
            />
            <FormField
              label="Release Date"
              value={item.releaseDate}
              onChange={(value) =>
                updateArrayItem('publications', index, 'releaseDate', value)
              }
              placeholder="YYYY-MM-DD"
            />
            <FormField
              label="URL"
              type="url"
              value={item.url}
              onChange={(value) =>
                updateArrayItem('publications', index, 'url', value)
              }
              placeholder="https://publication.com"
            />
          </div>
        )}
      />
    </FormSection>
  );
}
