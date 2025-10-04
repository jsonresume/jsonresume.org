'use client';

import { FormSection, FormField } from '../FormComponents';

export const BasicInfoForm = ({ resume, updateBasics }) => {
  return (
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
  );
};
