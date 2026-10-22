const format = async function format(resume) {
  return {
    content: JSON.stringify(resume, undefined, 4),
    headers: [
      { key: 'Content-Type', value: 'application/json; charset=utf-8' },
    ],
  };
};

const exports = { format };

export default exports;
