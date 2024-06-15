import { convert } from '../../../../packages/converters/jsonresume-to-rendercv/convert';

const format = async function format(resume) {
  const rendercv = await convert(resume);
  return { content: rendercv, headers: [] };
};

const exports = { format };

export default exports;
