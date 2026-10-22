/**
 * Basics section schema - personal information
 */
export const basics = {
  type: 'object',
  additionalProperties: true,
  properties: {
    custom: { $ref: '#/definitions/custom' },
    name: {
      type: 'string',
    },
    label: {
      type: 'string',
      description: 'e.g. Web Developer',
    },
    pronouns: {
      type: 'string',
      description: 'e.g. she/her, they/them',
    },
    image: {
      type: 'string',
      description: 'URL (as per RFC 3986) to a image in JPEG or PNG format',
    },
    email: {
      type: 'string',
      description: 'e.g. thomas@gmail.com',
      format: 'email',
    },
    phone: {
      type: 'string',
      description:
        'Phone numbers are stored as strings so use any format you like, e.g. 712-117-2923',
    },
    url: {
      type: 'string',
      description:
        'URL (as per RFC 3986) to your website, e.g. personal homepage',
      format: 'uri',
    },
    summary: {
      type: 'string',
      description: 'Write a short 2-3 sentence biography about yourself',
    },
    location: { $ref: '#/definitions/location' },
    profiles: {
      type: 'array',
      description:
        'Specify any number of social networks that you participate in',
      additionalItems: false,
      items: {
        type: 'object',
        additionalProperties: true,
        properties: {
          network: {
            type: 'string',
            description: 'e.g. Facebook or Twitter',
          },
          username: {
            type: 'string',
            description: 'e.g. neutralthoughts',
          },
          url: {
            type: 'string',
            description: 'e.g. http://twitter.example.com/neutralthoughts',
            format: 'uri',
          },
        },
      },
    },
  },
};
