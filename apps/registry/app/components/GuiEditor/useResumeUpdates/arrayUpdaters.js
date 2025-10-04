/**
 * Generic array section update handlers
 * Used for education, skills, languages, awards, etc.
 */

export const createArrayUpdaters = (resume, onChange) => {
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
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
  };
};
