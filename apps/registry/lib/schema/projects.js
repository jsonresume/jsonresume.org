/**
 * Projects schema
 */
export const projects = {
  type: 'array',
  description: 'Specify career projects',
  additionalItems: false,
  items: {
    type: 'object',
    additionalProperties: true,
    properties: {
      name: {
        type: 'string',
        description: 'e.g. The World Wide Web',
      },
      description: {
        type: 'string',
        description: 'Short summary of project. e.g. Collated works of 2017.',
      },
      highlights: {
        type: 'array',
        description: 'Specify multiple features',
        additionalItems: false,
        items: {
          type: 'string',
          description: 'e.g. Directs you close but not quite there',
        },
      },
      keywords: {
        type: 'array',
        description: 'Specify special elements involved',
        additionalItems: false,
        items: {
          type: 'string',
          description: 'e.g. AngularJS',
        },
      },
      startDate: {
        $ref: '#/definitions/iso8601',
      },
      endDate: {
        $ref: '#/definitions/iso8601',
      },
      url: {
        type: 'string',
        format: 'uri',
        description:
          'e.g. http://www.computer.org/csdl/mags/co/1996/10/rx069-abs.html',
      },
      roles: {
        type: 'array',
        description: 'Specify your role on this project or in company',
        additionalItems: false,
        items: {
          type: 'string',
          description: 'e.g. Team Lead, Speaker, Writer',
        },
      },
      entity: {
        type: 'string',
        description:
          "Specify the relevant company/entity affiliations e.g. 'greenpeace', 'corporationXYZ'",
      },
      type: {
        type: 'string',
        description:
          " e.g. 'volunteering', 'presentation', 'talk', 'application', 'conference'",
      },
    },
  },
};
