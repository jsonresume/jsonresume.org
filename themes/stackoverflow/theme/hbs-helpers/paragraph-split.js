const Handlebars = require('handlebars');

Handlebars.registerHelper('paragraphSplit', (plaintext) => {
  const lines = plaintext instanceof Array ? plaintext.join('').split(/\r\n|\r|\n/g) : plaintext.split(/\r\n|\r|\n/g);
  const output = lines.filter(line => line).reduce((a, b) => `${a}<p>${b}</p>`, '');
  return new Handlebars.SafeString(output);
});
