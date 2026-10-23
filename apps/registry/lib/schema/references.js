/**
 * References schema
 */
export const references = {
  type: 'array',
  description: 'List references you have received',
  additionalItems: false,
  items: {
    type: 'object',
    additionalProperties: true,
    properties: {
      custom: { $ref: '#/definitions/custom' },
      name: {
        type: 'string',
        description: 'e.g. Timothy Cook',
      },
      reference: {
        type: 'string',
        description:
          'e.g. Joe blogs was a great employee, who turned up to work at least once a week. He exceeded my expectations when it came to doing nothing.',
      },
      relationship: {
        type: 'string',
        description:
          'How the referee knows you. e.g. Manager, Peer, Client, Thesis advisor',
      },
      organization: {
        type: 'string',
        description: 'Where you worked together. e.g. Pied Piper',
      },
      date: {
        $ref: '#/definitions/iso8601',
      },
      availableOnRequest: {
        type: 'boolean',
        description:
          "Show 'available on request' rather than publishing the reference. Contact details are deliberately not part of the schema",
      },
    },
  },
};
