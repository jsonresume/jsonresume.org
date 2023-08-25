const format = async function format(resume) {
  return { content: JSON.stringify(resume, undefined, 4), headers: [] };
};

export default { format };
