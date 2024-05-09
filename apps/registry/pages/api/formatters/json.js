const format = async function format(resume) {
  return {
    content: JSON.stringify(resume, undefined, 4),
    headers: [
      {
        'Access-Control-Allow-Headers':
          'Origin, X-Requested-With, Content-Type, Accept',
      },
      { 'Access-Control-Allow-Origin': '*' },
    ],
  };
};

const exports = { format };

export default exports;
