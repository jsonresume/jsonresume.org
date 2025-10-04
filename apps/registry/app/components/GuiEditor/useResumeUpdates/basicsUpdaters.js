/**
 * Basics section update handlers
 */

export const createBasicsUpdaters = (resume, onChange) => {
  const updateBasics = (field, value) => {
    onChange({
      ...resume,
      basics: {
        ...resume.basics,
        [field]: value,
      },
    });
  };

  const updateLocation = (field, value) => {
    onChange({
      ...resume,
      basics: {
        ...resume.basics,
        location: {
          ...resume.basics?.location,
          [field]: value,
        },
      },
    });
  };

  return {
    updateBasics,
    updateLocation,
  };
};
