import { convert } from '../../../../packages/converters/jsonresume-to-rendercv/convert';

const format = async function format(resume) {
  const rendercv = await convert(resume);
  return {
    content: rendercv,
    headers: [
      { key: 'Content-Type', value: 'application/yaml; charset=utf-8' },
    ],
  };
};

const exports = { format };

export default exports;
