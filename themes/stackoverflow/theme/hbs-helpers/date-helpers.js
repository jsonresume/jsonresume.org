const moment = require('moment');
const Handlebars = require('handlebars');

Handlebars.registerHelper('MY', date => moment(date.toString(), ['YYYY-MM-DD']).format('MMMM YYYY'));
Handlebars.registerHelper('Y', date => moment(date.toString(), ['YYYY-MM-DD']).format('YYYY'));
Handlebars.registerHelper('DMY', date => moment(date.toString(), ['YYYY-MM-DD']).format('D MMMM YYYY'));