import { logger } from '@/lib/logger';

const parseEmbedding = (embedding) => {
  if (typeof embedding === 'string') {
    return JSON.parse(embedding);
  }
  return Array.isArray(embedding) ? embedding : null;
};

const parseResumeJSON = (resumeString, username) => {
  try {
    return JSON.parse(resumeString);
  } catch (e) {
    logger.warn({ error: e.message, username }, 'Failed to parse resume');
    return {};
  }
};

export const parseResumeData = (data) => {
  return data
    .map((item) => {
      const resumeData = parseResumeJSON(item.resume, item.username);

      return {
        username: item.username,
        embedding: parseEmbedding(item.embedding),
        position: resumeData?.basics?.label || 'Unknown Position',
      };
    })
    .filter((item) => item.embedding !== null);
};
