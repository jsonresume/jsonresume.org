/**
 * Work highlights update handlers
 */

export const createHighlightUpdaters = (resume, onChange) => {
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

  return {
    addHighlight,
    updateHighlight,
    removeHighlight,
  };
};
