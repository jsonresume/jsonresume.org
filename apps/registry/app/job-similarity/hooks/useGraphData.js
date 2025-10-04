import { useCallback } from 'react';
import { filterValidData } from './useGraphData/filterValidData';
import { groupItems } from './useGraphData/groupItems';
import { createNodes } from './useGraphData/createNodes';

/**
 * Hook to process raw API data into graph nodes
 * @param {string} dataSource - 'jobs' or 'resumes'
 * @returns {Object} { processData function }
 */
export const useGraphData = (dataSource) => {
  const processData = useCallback(
    (data) => {
      const validData = filterValidData(data, dataSource);
      const groups = groupItems(validData, dataSource);
      const nodes = createNodes(groups, dataSource);
      return nodes;
    },
    [dataSource]
  );

  return { processData };
};
