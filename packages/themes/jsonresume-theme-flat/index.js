var Handlebars = require('handlebars');
import css from './style';
import template from './resume';

module.exports = {
  render: render,
};

function render(resume) {
  return Handlebars.compile(template)({
    css: css,
    resume: resume,
  });
}

Handlebars.registerHelper('nl2br', function (value) {
  return (value || '').replace(/\n/g, '</p><p>');
});
