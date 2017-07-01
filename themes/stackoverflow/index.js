const fs = require('fs');
const path = require('path');
const requireDir = require('require-dir');
const Handlebars = require('handlebars');

const HBS_HELPERS = './theme/hbs-helpers';

function render(resume) {
  const css = fs.readFileSync(`${__dirname}/style.css`, 'utf-8');
  const tpl = fs.readFileSync(`${__dirname}/resume.hbs`, 'utf-8');
  const partialsDir = path.join(__dirname, 'theme/partials');
  const filenames = fs.readdirSync(partialsDir);

  filenames.forEach((filename) => {
    const matches = /^([^.]+).hbs$/.exec(filename);
    if (!matches) return;
    const name = matches[1];
    const filepath = path.join(partialsDir, filename);
    const template = fs.readFileSync(filepath, 'utf8');

    Handlebars.registerPartial(name, template);
  });

  return Handlebars.compile(tpl)({
    css,
    resume,
  });
}

/* HANDLEBARS HELPERS */
requireDir(HBS_HELPERS, { recurse: true });

module.exports = { render };
