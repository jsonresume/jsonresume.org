// Helper function to intelligently merge arrays
export const mergeArrays = (
  existingArray = [],
  newArray = [],
  key = 'name'
) => {
  const result = [...existingArray];

  newArray.forEach((newItem) => {
    // For deletion (marked with _delete flag)
    if (newItem._delete) {
      const index = result.findIndex(
        (item) =>
          item[key] === newItem[key] ||
          (item.startDate === newItem.startDate &&
            item.endDate === newItem.endDate)
      );
      if (index !== -1) {
        result.splice(index, 1);
      }
      return;
    }

    // For updates or additions
    const existingIndex = result.findIndex(
      (item) =>
        item[key] === newItem[key] ||
        (item.startDate === newItem.startDate &&
          item.endDate === newItem.endDate)
    );

    if (existingIndex !== -1) {
      // Update existing item
      result[existingIndex] = { ...result[existingIndex], ...newItem };
    } else {
      // Add new item
      result.push(newItem);
    }
  });

  return result;
};

export const applyChanges = (currentResume, changes) => {
  const newResume = { ...currentResume };

  // Process each section of changes
  Object.entries(changes).forEach(([section, value]) => {
    if (Array.isArray(value)) {
      // Handle array sections (work, education, etc.)
      newResume[section] = mergeArrays(
        currentResume[section],
        value,
        section === 'skills' ? 'name' : 'name' // Use appropriate key for matching
      );
    } else if (typeof value === 'object' && value !== null) {
      // Handle nested objects
      newResume[section] = { ...currentResume[section], ...value };
    } else {
      // Handle primitive values
      newResume[section] = value;
    }
  });

  return newResume;
};
