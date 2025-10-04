export const basicsSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    label: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    url: { type: 'string' },
    summary: { type: 'string' },
    location: {
      type: 'object',
      properties: {
        address: { type: 'string' },
        postalCode: { type: 'string' },
        city: { type: 'string' },
        countryCode: { type: 'string' },
        region: { type: 'string' },
      },
    },
    profiles: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          network: { type: 'string' },
          username: { type: 'string' },
          url: { type: 'string' },
        },
      },
    },
  },
};
