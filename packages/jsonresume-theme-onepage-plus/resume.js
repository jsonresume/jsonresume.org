export default `<!doctype html>
<html>
	<head>
	
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, user-scalable=no, minimal-ui">
	
	<title>{{#resume.basics}}{{name}}{{/resume.basics}}</title>

	<style>
	{{{css}}}
	</style>
	
	</head>
	<body>
	
	<div id="resume">
		{{> basics }}
		{{> education }}
		{{> skills }}
		{{> work }}
		{{> publications }}
		{{> projects}}
		{{> certificates }}
		{{> awards }}
		{{> volunteer }}
		{{> languages }}
		{{> interests }}
		{{> references }}
	</body>
</html>`;
