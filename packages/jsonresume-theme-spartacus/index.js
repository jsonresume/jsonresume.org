import css from './style';
import tpl from './resume';

const Handlebars = require('handlebars');
const Moment = require('moment');

function render(resume) {
  return Handlebars.compile(tpl)({
    css: css,
    resume: resume,
  });
}

module.exports = {
  render,
};

Handlebars.registerHelper('prettifyDate', function (resumeDate) {
  if (!resumeDate) {
    return 'Present';
  }
  const newDate = Moment(resumeDate).format('MMM YYYY');
  return newDate;
});
