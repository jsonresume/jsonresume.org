const YAML = require('json-to-pretty-yaml');
import convert from '../../../../packages/converters/jsonresume-to-rendercv/convert';

const networks = {
  facebook: 'Facebook',
  github: 'GitHub',
  gitlab: 'GitLab',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  medium: 'Medium',
  stackoverflow: 'StackOverflow',
  twitter: 'Twitter',
  youtube: 'YouTube',
};

const format = async function format(jsonResume) {
  const rendercv = convert(jsonResume);
  return { content: rendercv, headers: [] };
};

const exports = { format };

export default exports;
