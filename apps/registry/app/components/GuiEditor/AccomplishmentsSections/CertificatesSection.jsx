'use client';

import { FormSection, FormField, ArrayField } from '../FormComponents';

export function CertificatesSection({ certificates, handlers }) {
  const { updateArrayItem, addArrayItem, removeArrayItem } = handlers;

  return (
    <FormSection title="Certificates">
      <ArrayField
        items={certificates || []}
        onAdd={() =>
          addArrayItem('certificates', {
            name: '',
            date: '',
            issuer: '',
            url: '',
          })
        }
        onRemove={(index) => removeArrayItem('certificates', index)}
        addLabel="Add Certificate"
        renderItem={(item, index) => (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Name"
              value={item.name}
              onChange={(value) =>
                updateArrayItem('certificates', index, 'name', value)
              }
              placeholder="Certificate Name"
            />
            <FormField
              label="Date"
              value={item.date}
              onChange={(value) =>
                updateArrayItem('certificates', index, 'date', value)
              }
              placeholder="YYYY-MM-DD"
            />
            <FormField
              label="Issuer"
              value={item.issuer}
              onChange={(value) =>
                updateArrayItem('certificates', index, 'issuer', value)
              }
              placeholder="Issuing Organization"
            />
            <FormField
              label="URL"
              type="url"
              value={item.url}
              onChange={(value) =>
                updateArrayItem('certificates', index, 'url', value)
              }
              placeholder="https://certificate.com"
            />
          </div>
        )}
      />
    </FormSection>
  );
}
