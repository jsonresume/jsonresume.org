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
      custom: { $ref: '#/definitions/custom' },
      name: {
        type: 'string',
        description: 'e.g. The World Wide Web',
      },
      authors: {
        type: 'array',
        description:
          "Authors in published order, including the resume owner. e.g. ['Richard Hendriks', 'Bertram Gilfoyle']",
        items: { type: 'string' },
      },
      publisher: {
        type: 'string',
        description: 'e.g. IEEE, Computer Magazine. For talks, the event name',
      },
      releaseDate: {
        $ref: '#/definitions/iso8601',
      },
      volume: { type: 'string', description: 'e.g. 12' },
      issue: { type: 'string', description: 'e.g. 3' },
      pages: { type: 'string', description: 'e.g. 45-67' },
      identifiers: {
        type: 'object',
        description:
          'Persistent identifiers keyed by scheme, e.g. doi, isbn, arxiv, pmid',
        additionalProperties: { type: 'string' },
        properties: {
          doi: { type: 'string', description: 'e.g. 10.1000/182' },
          isbn: { type: 'string', description: 'e.g. 978-3-7502-4718-5' },
          arxiv: { type: 'string', description: 'e.g. 2101.00001' },
        },
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
      type: {
        type: 'string',
        description: "e.g. 'article', 'book', 'patent', 'thesis', 'talk'",
      },
    },
  },
};
