/**
 * Work experience update handlers
 */

const WORK_TEMPLATE = {
  name: '',
  position: '',
  startDate: '',
  endDate: '',
  location: '',
  url: '',
  summary: '',
  description: '',
  highlights: [],
};

export const createWorkUpdaters = (resume, onChange) => {
  const updateWorkExperience = (index, field, value) => {
    const newWork = [...(resume.work || [])];
    newWork[index] = { ...newWork[index], [field]: value };
    onChange({ ...resume, work: newWork });
  };

  const addWorkExperience = () => {
    onChange({
      ...resume,
      work: [...(resume.work || []), WORK_TEMPLATE],
    });
  };

  const removeWorkExperience = (index) => {
    const newWork = [...(resume.work || [])];
    newWork.splice(index, 1);
    onChange({ ...resume, work: newWork });
  };

  return {
    updateWorkExperience,
    addWorkExperience,
    removeWorkExperience,
  };
};
