/**
 * Filter out items without valid embeddings
 */
export const filterValidData = (data, dataSource) => {
  return data.filter((item) => {
    const embedding =
      dataSource === 'jobs'
        ? item.embedding
        : typeof item.embedding === 'string'
        ? JSON.parse(item.embedding)
        : item.embedding;
    return Array.isArray(embedding) && embedding.length > 0;
  });
};
