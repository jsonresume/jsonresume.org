var fs = require("fs");
var Handlebars = require("handlebars");
var moment = require("moment");

function render(resume) {
	var css = fs.readFileSync(__dirname + "/style.css", "utf-8");
	var tpl = fs.readFileSync(__dirname + "/resume.hbs", "utf-8");
	
	return Handlebars.compile(tpl)({
		css: css,
		resume: resume
	});
}

module.exports = {
	render: render
};


/* HANDLEBARS HELPERS */
Handlebars.registerHelper('paragraphSplit', function(plaintext) {
    var lines = plaintext.split(/\r\n|\r|\n/g);
    var output = '';
    var i;

    for (i = 0; i < lines.length; i+=1) {
        if(lines[i]) {
            output += '<p>' + lines[i] + '</p>';
        }
    }
    return new Handlebars.SafeString(output);
});

Handlebars.registerHelper('toLowerCase', function(str) {
  return str.toLowerCase();
});

Handlebars.registerHelper('spaceToDash', function(str) {
  return str.replace(/\s/g, '-').toLowerCase();
});

Handlebars.registerHelper('MY', function(date) {
	var d = date.toString();
	return moment(d).format('MMMM YYYY');
});

Handlebars.registerHelper('Y', function(date) {
	var d = date.toString();
  return moment(d).format('YYYY');
});

Handlebars.registerHelper('DMY', function(date) {
	var d = date.toString();
  return moment(d).format('D MMMM YYYY');
});