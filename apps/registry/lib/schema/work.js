/**
 * Work experience schema
 */
export const work = {
  type: 'array',
  additionalItems: false,
  items: {
    type: 'object',
    additionalProperties: true,
    properties: {
      custom: { $ref: '#/definitions/custom' },
      name: {
        type: 'string',
        description: 'e.g. Facebook',
      },
      location: {
        oneOf: [
          { type: 'string', description: 'Free text, e.g. Menlo Park, CA' },
          { $ref: '#/definitions/location' },
        ],
      },
      description: {
        type: 'string',
        description: 'e.g. Social Media Company',
      },
      position: {
        type: 'string',
        description: 'e.g. Software Engineer',
      },
      type: {
        type: 'string',
        description:
          "Employment type, free text: e.g. 'full-time', 'part-time', 'contract', 'freelance', 'internship', 'temporary'. Combinations such as 'part-time contract' are fine. The role as it was, not what you're looking for (#599).",
      },
      url: {
        type: 'string',
        description: 'e.g. http://facebook.example.com',
        format: 'uri',
      },
      startDate: {
        $ref: '#/definitions/iso8601',
      },
      endDate: {
        $ref: '#/definitions/iso8601',
      },
      summary: {
        type: 'string',
        description: 'Give an overview of your responsibilities at the company',
      },
      highlights: {
        type: 'array',
        description: 'Specify multiple accomplishments',
        additionalItems: false,
        items: {
          type: 'string',
          description:
            'e.g. Increased profits by 20% from 2011-2012 through viral advertising',
        },
      },
      keywords: {
        type: 'array',
        description: 'Skills, tools or technologies used in this role',
        items: {
          type: 'string',
          description: 'e.g. React',
        },
      },
    },
  },
};
