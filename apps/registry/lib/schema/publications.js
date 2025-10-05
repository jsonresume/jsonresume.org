/**
 * Publications schema
 */
export const publications = {
  type: 'array',
  description: 'Specify your publications through your career',
  additionalItems: false,
  items: {
    type: 'object',
    additionalProperties: true,
    properties: {
      name: {
        type: 'string',
        description: 'e.g. The World Wide Web',
      },
      publisher: {
        type: 'string',
        description: 'e.g. IEEE, Computer Magazine',
      },
      releaseDate: {
        $ref: '#/definitions/iso8601',
      },
      url: {
        type: 'string',
        description:
          'e.g. http://www.computer.org.example.com/csdl/mags/co/1996/10/rx069-abs.html',
        format: 'uri',
      },
      summary: {
        type: 'string',
        description:
          'Short summary of publication. e.g. Discussion of the World Wide Web, HTTP, HTML.',
      },
    },
  },
};
