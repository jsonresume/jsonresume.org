/**
 * Meta schema - version and tooling configuration
 */
export const meta = {
  type: 'object',
  description:
    'The schema version and any other tooling configuration lives here',
  additionalProperties: true,
  properties: {
    canonical: {
      type: 'string',
      description: 'URL (as per RFC 3986) to latest version of this document',
      format: 'uri',
    },
    version: {
      type: 'string',
      description: 'A version field which follows semver - e.g. v1.0.0',
    },
    lastModified: {
      type: 'string',
      description: 'Using ISO 8601 with YYYY-MM-DDThh:mm:ss',
    },
    language: {
      type: 'string',
      description:
        'The language this resume is written in, as a BCP 47 tag, e.g. en, pt-BR. One document per language (#288)',
    },
    translations: {
      type: 'array',
      description:
        'The same resume in other languages, one document each (#288)',
      items: {
        type: 'object',
        additionalProperties: true,
        properties: {
          language: {
            type: 'string',
            description: 'BCP 47 tag of that document, e.g. fr',
          },
          url: {
            type: 'string',
            description: 'URL (as per RFC 3986) of that document',
            format: 'uri',
          },
        },
      },
    },
  },
};
