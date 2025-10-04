export const skillsSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      level: { type: 'string' },
      keywords: {
        type: 'array',
        items: { type: 'string' },
      },
      _delete: { type: 'boolean' },
    },
  },
};
