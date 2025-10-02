'use client';

import { FormSection, FormField, ArrayField } from './FormComponents';

export const BasicsSection = ({ resume, handlers }) => {
  const {
    updateBasics,
    updateLocation,
    updateProfiles,
    addProfile,
    removeProfile,
  } = handlers;

  return (
    <>
      <FormSection title="Basic Information" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Full Name"
            value={resume.basics?.name}
            onChange={(value) => updateBasics('name', value)}
            placeholder="John Doe"
          />
          <FormField
            label="Label"
            value={resume.basics?.label}
            onChange={(value) => updateBasics('label', value)}
            placeholder="Software Engineer"
          />
          <FormField
            label="Email"
            type="email"
            value={resume.basics?.email}
            onChange={(value) => updateBasics('email', value)}
            placeholder="john@example.com"
          />
          <FormField
            label="Phone"
            value={resume.basics?.phone}
            onChange={(value) => updateBasics('phone', value)}
            placeholder="+1 (123) 456-7890"
          />
          <FormField
            label="Website"
            type="url"
            value={resume.basics?.url}
            onChange={(value) => updateBasics('url', value)}
            placeholder="https://example.com"
          />
          <FormField
            label="Image URL"
            type="url"
            value={resume.basics?.image}
            onChange={(value) => updateBasics('image', value)}
            placeholder="https://example.com/photo.jpg"
          />
        </div>
        <FormField
          label="Summary"
          type="textarea"
          value={resume.basics?.summary}
          onChange={(value) => updateBasics('summary', value)}
          placeholder="A brief summary about yourself..."
        />
      </FormSection>

      <FormSection title="Location">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Address"
            type="textarea"
            value={resume.basics?.location?.address}
            onChange={(value) => updateLocation('address', value)}
            placeholder="123 Main St"
          />
          <FormField
            label="Postal Code"
            value={resume.basics?.location?.postalCode}
            onChange={(value) => updateLocation('postalCode', value)}
            placeholder="12345"
          />
          <FormField
            label="City"
            value={resume.basics?.location?.city}
            onChange={(value) => updateLocation('city', value)}
            placeholder="San Francisco"
          />
          <FormField
            label="Region"
            value={resume.basics?.location?.region}
            onChange={(value) => updateLocation('region', value)}
            placeholder="California"
          />
          <FormField
            label="Country Code"
            value={resume.basics?.location?.countryCode}
            onChange={(value) => updateLocation('countryCode', value)}
            placeholder="US"
          />
        </div>
      </FormSection>

      <FormSection title="Profiles">
        <ArrayField
          items={resume.basics?.profiles || []}
          onAdd={addProfile}
          onRemove={removeProfile}
          addLabel="Add Profile"
          renderItem={(item, index) => (
            <div className="grid grid-cols-3 gap-4">
              <FormField
                label="Network"
                value={item.network}
                onChange={(value) => updateProfiles(index, 'network', value)}
                placeholder="Twitter"
              />
              <FormField
                label="Username"
                value={item.username}
                onChange={(value) => updateProfiles(index, 'username', value)}
                placeholder="@johndoe"
              />
              <FormField
                label="URL"
                type="url"
                value={item.url}
                onChange={(value) => updateProfiles(index, 'url', value)}
                placeholder="https://twitter.com/johndoe"
              />
            </div>
          )}
        />
      </FormSection>
    </>
  );
};
