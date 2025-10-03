/**
 * OpenAI function schema for converting job descriptions to structured JSON
 */
const jobDescriptionToSchemaFunction = {
  name: 'jobDescriptionToSchema',
  description: 'Takes a fluid job description and turns it into a JSON schema',
  parameters: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      company: { type: 'string' },
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
      position: { type: 'string' },
      type: { type: 'string' },
      salary: { type: 'string' },
      date: { type: 'string' },
      remote: { type: 'string' },
      description: { type: 'string' },
      responsibilities: {
        type: 'array',
        items: { type: 'string' },
      },
      qualifications: {
        type: 'array',
        items: { type: 'string' },
      },
      skills: {
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
          },
        },
      },
      experience: { type: 'string' },
      education: { type: 'string' },
      application: { type: 'string' },
    },
    required: [],
  },
};

module.exports = jobDescriptionToSchemaFunction;
