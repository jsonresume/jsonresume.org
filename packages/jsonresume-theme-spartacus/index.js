var Handlebars = require('handlebars');
var Moment = require('moment');
import css from './style';
import tpl from './resume';

function render(resume) {
  return Handlebars.compile(tpl)({
    css: css,
    resume: resume,
  });
}

module.exports = {
  render: render,
};

Handlebars.registerHelper('prettifyDate', function (resumeDate) {
  if (!resumeDate) {
    return 'Present';
  }
  var newDate = Moment(resumeDate).format('MMM YYYY');
  return newDate;
});
