export const useResumeUpdates = (resume, onChange) => {
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

  const updateWorkExperience = (index, field, value) => {
    const newWork = [...(resume.work || [])];
    newWork[index] = { ...newWork[index], [field]: value };
    onChange({ ...resume, work: newWork });
  };

  const addWorkExperience = () => {
    onChange({
      ...resume,
      work: [
        ...(resume.work || []),
        {
          name: '',
          position: '',
          startDate: '',
          endDate: '',
          location: '',
          url: '',
          summary: '',
          description: '',
          highlights: [],
        },
      ],
    });
  };

  const removeWorkExperience = (index) => {
    const newWork = [...(resume.work || [])];
    newWork.splice(index, 1);
    onChange({ ...resume, work: newWork });
  };

  const addHighlight = (workIndex) => {
    const newWork = [...(resume.work || [])];
    newWork[workIndex] = {
      ...newWork[workIndex],
      highlights: [...(newWork[workIndex].highlights || []), ''],
    };
    onChange({ ...resume, work: newWork });
  };

  const updateHighlight = (workIndex, highlightIndex, value) => {
    const newWork = [...(resume.work || [])];
    newWork[workIndex].highlights[highlightIndex] = value;
    onChange({ ...resume, work: newWork });
  };

  const removeHighlight = (workIndex, highlightIndex) => {
    const newWork = [...(resume.work || [])];
    newWork[workIndex].highlights.splice(highlightIndex, 1);
    onChange({ ...resume, work: newWork });
  };

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
        profiles: [
          ...(resume.basics?.profiles || []),
          { network: '', username: '', url: '' },
        ],
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

  const updateArrayItem = (section, index, field, value) => {
    const newArray = [...(resume[section] || [])];
    newArray[index] = { ...newArray[index], [field]: value };
    onChange({ ...resume, [section]: newArray });
  };

  const addArrayItem = (section, template) => {
    onChange({
      ...resume,
      [section]: [...(resume[section] || []), template],
    });
  };

  const removeArrayItem = (section, index) => {
    const newArray = [...(resume[section] || [])];
    newArray.splice(index, 1);
    onChange({ ...resume, [section]: newArray });
  };

  return {
    updateBasics,
    updateLocation,
    updateWorkExperience,
    addWorkExperience,
    removeWorkExperience,
    addHighlight,
    updateHighlight,
    removeHighlight,
    updateProfiles,
    addProfile,
    removeProfile,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
  };
};
