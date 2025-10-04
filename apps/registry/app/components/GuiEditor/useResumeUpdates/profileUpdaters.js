/**
 * Profile (social links) update handlers
 */

const PROFILE_TEMPLATE = {
  network: '',
  username: '',
  url: '',
};

export const createProfileUpdaters = (resume, onChange) => {
  const updateProfiles = (index, field, value) => {
    const newProfiles = [...(resume.basics?.profiles || [])];
    newProfiles[index] = { ...newProfiles[index], [field]: value };
    onChange({
      ...resume,
      basics: {
        ...resume.basics,
        profiles: newProfiles,
      },
    });
  };

  const addProfile = () => {
    onChange({
      ...resume,
      basics: {
        ...resume.basics,
        profiles: [...(resume.basics?.profiles || []), PROFILE_TEMPLATE],
      },
    });
  };

  const removeProfile = (index) => {
    const newProfiles = [...(resume.basics?.profiles || [])];
    newProfiles.splice(index, 1);
    onChange({
      ...resume,
      basics: {
        ...resume.basics,
        profiles: newProfiles,
      },
    });
  };

  return {
    updateProfiles,
    addProfile,
    removeProfile,
  };
};
