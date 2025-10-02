'use client';

import { FormSection, FormField, ArrayField } from './FormComponents';

export const AccomplishmentsSection = ({ resume, handlers }) => {
  const { updateArrayItem, addArrayItem, removeArrayItem } = handlers;

  return (
    <>
      <FormSection title="Awards">
        <ArrayField
          items={resume.awards || []}
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

      <FormSection title="Certificates">
        <ArrayField
          items={resume.certificates || []}
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

      <FormSection title="Publications">
        <ArrayField
          items={resume.publications || []}
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
    </>
  );
};
