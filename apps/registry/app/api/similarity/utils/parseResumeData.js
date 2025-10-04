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
    console.warn('Failed to parse resume for user:', username);
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
