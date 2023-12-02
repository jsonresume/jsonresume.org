const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

//@todo - figure out how to get the relative directory

const configDirectory = path.resolve(process.cwd(), 'config');
console.log(configDirectory);
const themePath = path.resolve(
  process.cwd(),
  '../../packages/jsonresume-theme-full'
);
function render(resume) {
  const css = fs.readFileSync(path.join(themePath, 'style.css'), 'utf-8');
  const template = fs.readFileSync(path.join(themePath, 'resume.hbs'), 'utf-8');
  const partialsDir = path.join(themePath, 'partials');

  const filenames = fs.readdirSync(partialsDir);

  filenames.forEach(function (filename) {
    const matches = /^([^.]+).hbs$/.exec(filename);
    if (!matches) {
      return;
    }
    const name = matches[1];
    const filepath = path.join(partialsDir, filename);

    const template = fs.readFileSync(filepath, 'utf8');

    Handlebars.registerPartial(name, template);
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
