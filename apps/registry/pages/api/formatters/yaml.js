const format = async function format(resume) {
  const YAML = require('json-to-pretty-yaml');
  const content = YAML.stringify(resume);
  return { content, headers: [] };
};

export default { format };
