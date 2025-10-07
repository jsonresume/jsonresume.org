export const workSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      position: { type: 'string' },
      url: { type: 'string' },
      startDate: { type: 'string' },
      endDate: { type: 'string' },
      summary: { type: 'string' },
      highlights: {
        type: 'array',
        items: { type: 'string' },
      },
      technologies: {
        type: 'array',
        items: { type: 'string' },
      },
      _delete: { type: 'boolean' },
    },
  },
};
