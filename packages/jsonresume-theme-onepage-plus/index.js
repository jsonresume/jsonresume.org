var fs = require('fs');
var path = require('path');
var Handlebars = require('handlebars');
import { partials } from './partials';
import template from './resume';
import css from './style';

// Handlebars.registerHelper('formatDate', dateString =>
//     new Date(dateString).toLocaleDateString('en', {
//         month: 'short',
//         year: 'numeric',
//     }),
// );

Handlebars.registerHelper('formatDate', function (dateString) {
  let dateStrArr = dateString.split('-');

  if (dateStrArr[0] && dateStrArr[1] && dateStrArr[2])
    return new Date(dateString).toLocaleDateString('en', {
      month: 'short',
      year: 'numeric',
      day: 'numeric',
    });

  if (dateStrArr[0] && dateStrArr[1])
    return new Date(dateString).toLocaleDateString('en', {
      month: 'short',
      year: 'numeric',
    });

  return dateStrArr;
});

function render(resume) {
  Object.entries(partials).forEach(function ([key, partial]) {
    Handlebars.registerPartial(key, partial);
  });

  return Handlebars.compile(template)({
    css,
    resume,
  });
}

module.exports = {
  render,
};
