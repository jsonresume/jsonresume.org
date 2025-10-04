'use client';

import { FormSection, FormField } from '../FormComponents';

export const LocationForm = ({ resume, updateLocation }) => {
  return (
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
  );
};
