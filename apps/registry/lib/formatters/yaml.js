const format = async function format(resume) {
  const YAML = require('json-to-pretty-yaml');
  const content = YAML.stringify(resume);
  return {
    content,
    headers: [
      { key: 'Content-Type', value: 'application/yaml; charset=utf-8' },
    ],
  };
};

const exports = { format };

export default exports;
