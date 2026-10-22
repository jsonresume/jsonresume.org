const basics = require('./resume/basics');
const work = require('./resume/work');
const other = require('./resume/other');

const resume = {
  ...other,
  basics,
  work,
};

module.exports = resume;
