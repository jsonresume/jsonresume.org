'use client';

import { BasicInfoForm, LocationForm, ProfilesForm } from './BasicsSections';

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
      <BasicInfoForm resume={resume} updateBasics={updateBasics} />
      <LocationForm resume={resume} updateLocation={updateLocation} />
      <ProfilesForm
        resume={resume}
        updateProfiles={updateProfiles}
        addProfile={addProfile}
        removeProfile={removeProfile}
      />
    </>
  );
};
