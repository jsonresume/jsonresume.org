export const RESUME_TOOL_SCHEMA = {
  update_resume: {
    description: 'Update specific sections of the resume with new information',
    parameters: {
      type: 'object',
      properties: {
        changes: {
          type: 'object',
          description: 'Changes to apply to the resume',
          properties: {
            basics: {
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
            },
            work: {
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
            },
            education: {
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
                  _delete: { type: 'boolean' },
                },
              },
            },
          },
        },
        explanation: {
          type: 'string',
          description:
            'A brief, friendly explanation of the changes being made',
        },
      },
      required: ['changes', 'explanation'],
    },
  },
};
