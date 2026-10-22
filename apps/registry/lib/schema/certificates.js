/**
 * Certificates schema
 */
export const certificates = {
  type: 'array',
  description:
    'Specify any certificates you have received throughout your professional career',
  additionalItems: false,
  items: {
    type: 'object',
    additionalProperties: true,
    properties: {
      custom: { $ref: '#/definitions/custom' },
      name: {
        type: 'string',
        description: 'e.g. Certified Kubernetes Administrator',
      },
      date: {
        $ref: '#/definitions/iso8601',
      },
      url: {
        type: 'string',
        description: 'e.g. http://example.com',
        format: 'uri',
      },
      issuer: {
        type: 'string',
        description: 'e.g. CNCF',
      },
      expiryDate: {
        $ref: '#/definitions/iso8601',
      },
    },
  },
};
