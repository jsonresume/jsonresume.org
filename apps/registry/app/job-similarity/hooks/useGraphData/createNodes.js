import {
  normalizeVector,
  getAverageEmbedding,
} from '../../../utils/vectorUtils';
import { colors } from '../../utils/constants';

/**
 * Create graph nodes from grouped items
 */
export const createNodes = (groups, dataSource) => {
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
                  items.map((item) => item.countryCode || 'Unknown Location')
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
};
