'use client';

import { FormSection, FormField, ArrayField } from '../FormComponents';

export const ProfilesForm = ({
  resume,
  updateProfiles,
  addProfile,
  removeProfile,
}) => {
  return (
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
  );
};
