const gravatar = require('gravatar');

export const formatCandidates = (matches) => {
  return matches.map((match) => {
    try {
      const resume = JSON.parse(match.resume);
      return {
        username: match.username,
        similarity: match.similarity,
        label: resume?.basics?.label,
        image:
          resume?.basics?.image ||
          gravatar.url(
            resume?.basics?.email || '',
            {
              s: '200',
              r: 'x',
              d: 'retro',
            },
            true
          ),
        name: resume?.basics?.name,
        location: resume?.basics?.location,
        skills: resume?.skills?.map((s) => s.name) || [],
        headline: resume?.basics?.summary,
        updated_at: match.updated_at,
        created_at: match.created_at,
      };
    } catch (e) {
      console.error('Error parsing resume:', e);
      return {
        username: match.username,
        similarity: match.similarity,
        label: 'Error parsing resume',
        image: gravatar.url('', { s: '200', r: 'x', d: 'retro' }, true),
        name: match.username,
        location: null,
        skills: [],
        headline: null,
        updated_at: match.updated_at,
        created_at: match.created_at,
      };
    }
  });
};
