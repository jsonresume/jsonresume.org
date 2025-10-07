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
  },
};
