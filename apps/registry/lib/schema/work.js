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
          "How the role was held. Free text; recommended values: 'full-time', 'part-time', 'contract', 'freelance', 'internship', 'temporary'. Combine them as needed, e.g. 'part-time contract'. Describes past roles, not what you are looking for (#599). A career break is a work entry with type 'career-break', its dates and an optional summary, and no name (#589)",
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
