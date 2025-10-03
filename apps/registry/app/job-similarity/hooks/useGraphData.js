import { useCallback } from 'react';
import { normalizeVector, getAverageEmbedding } from '../utils/vectorUtils';
import { colors } from '../utils/constants';

/**
 * Hook to process raw API data into graph nodes
 * @param {string} dataSource - 'jobs' or 'resumes'
 * @returns {Object} { processData function }
 */
export const useGraphData = (dataSource) => {
  const processData = useCallback(
    (data) => {
      // Filter out items without valid embeddings
      const validData = data.filter((item) => {
        const embedding =
          dataSource === 'jobs'
            ? item.embedding
            : typeof item.embedding === 'string'
            ? JSON.parse(item.embedding)
            : item.embedding;
        return Array.isArray(embedding) && embedding.length > 0;
      });

      // Group similar items
      const groups = {};

      validData.forEach((item) => {
        const label =
          dataSource === 'jobs'
            ? item.title
            : item.position || 'Unknown Position';

        if (!groups[label]) {
          groups[label] = [];
        }
        groups[label].push(item);
      });

      // Create nodes with normalized embeddings
      const nodes = Object.entries(groups)
        .map(([label, items], index) => {
          const embeddings = items.map((item) => {
            if (dataSource === 'jobs') return item.embedding;
            return typeof item.embedding === 'string'
              ? JSON.parse(item.embedding)
              : item.embedding;
          });

          const normalizedEmbeddings = embeddings
            .map((emb) => normalizeVector(emb))
            .filter((emb) => emb !== null);

          if (normalizedEmbeddings.length === 0) return null;

          const avgEmbedding = getAverageEmbedding(normalizedEmbeddings);
          if (!avgEmbedding) return null;

          return {
            id: label,
            group: index,
            size: Math.log(items.length + 1) * 3,
            count: items.length,
            uuids: items.map((item) =>
              dataSource === 'jobs' ? item.uuid : item.username
            ),
            usernames:
              dataSource === 'jobs'
                ? null
                : [...new Set(items.map((item) => item.username))],
            avgEmbedding,
            color: colors[index % colors.length],
            companies:
              dataSource === 'jobs'
                ? [
                    ...new Set(
                      items.map((item) => item.company || 'Unknown Company')
                    ),
                  ]
                : null,
            countryCodes:
              dataSource === 'jobs'
                ? [
                    ...new Set(
                      items.map(
                        (item) => item.countryCode || 'Unknown Location'
                      )
                    ),
                  ]
                : null,
          };
        })
        .filter((node) => node !== null);

      if (nodes.length === 0) {
        throw new Error('No valid data found with embeddings');
      }

      return nodes;
    },
    [dataSource]
  );

  return { processData };
};
