const Handlebars = require('handlebars');

Handlebars.registerHelper('spaceToDash', str => str.replace(/\s/g, '-').toLowerCase());
