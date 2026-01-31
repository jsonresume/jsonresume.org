import Handlebars from 'handlebars';
import css from './style.js';
import template from './resume.js';

Handlebars.registerHelper('nl2br', function (value) {
  return (value || '').replace(/\n/g, '</p><p>');
});

export function render(resume) {
  return Handlebars.compile(template)({
    css: css,
    resume: resume,
  });
}
