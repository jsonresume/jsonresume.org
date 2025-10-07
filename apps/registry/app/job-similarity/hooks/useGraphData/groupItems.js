/**
 * Group similar items by label
 */
export const groupItems = (validData, dataSource) => {
  const groups = {};

  validData.forEach((item) => {
    const label =
      dataSource === 'jobs' ? item.title : item.position || 'Unknown Position';

    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(item);
  });

  return groups;
};
