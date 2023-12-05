const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
import css from './style';
import template from './resume';
import awards from './partials/awards';
import basics from './partials/basics';
import certificates from './partials/certificates';
import education from './partials/education';
import interests from './partials/interests';
import languages from './partials/languages';
import projects from './partials/projects';
import publications from './partials/publications';
import references from './partials/references';
import skills from './partials/skills';
import volunteer from './partials/volunteer';
import work from './partials/work';

const partials = {
  awards,
  basics,
  certificates,
  education,
  interests,
  languages,
  projects,
  publications,
  references,
  skills,
  volunteer,
  work,
};

function render(resume) {
  Object.entries(partials).forEach(function ([key, partial]) {
    Handlebars.registerPartial(key, partial);
  });

  // Nicer dates
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  Handlebars.registerHelper('date', function (date) {
    const theDate = new Date(date);
    return `${months[theDate.getMonth()]} ${theDate.getFullYear()}`;
  });

  return Handlebars.compile(template)({
    css: css,
    resume: resume,
  });
}

Handlebars.registerHelper('paragraphSplit', function (plaintext) {
  let output = '';
  const lines = plaintext.split(/\r\n|\r|\n/g);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i]) {
      output += '<p>' + lines[i] + '</p>';
    }
  }
  return new Handlebars.SafeString(output);
});

Handlebars.registerHelper('ifNotEquals', function (a, b, options) {
  if (a != b) {
    return options.fn(this);
  }
  return options.inverse(this);
});

module.exports = {
  render: render,
};
