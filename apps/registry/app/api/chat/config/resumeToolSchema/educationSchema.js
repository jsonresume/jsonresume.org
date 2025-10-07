export const educationSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      institution: { type: 'string' },
      area: { type: 'string' },
      studyType: { type: 'string' },
      startDate: { type: 'string' },
      endDate: { type: 'string' },
      score: { type: 'string' },
      _delete: { type: 'boolean' },
    },
  },
};
