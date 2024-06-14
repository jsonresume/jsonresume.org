import convert from '../../../../packages/converters/jsonresume-to-rendercv/convert';

const format = async function format(jsonResume) {
  const rendercv = convert(jsonResume);
  return { content: rendercv, headers: [] };
};

const exports = { format };

export default exports;
