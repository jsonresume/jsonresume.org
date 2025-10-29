export default `<!doctype html>
<html>
	<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, user-scalable=no, minimal-ui">
	<title>{{#resume.basics}}{{name}} {{#if label}} - {{label}}{{/if}}{{/resume.basics}}</title>
	<style>
  	{{{css}}}
	</style>
	<style media="print">
		body { font-size: 12px; }
	</style>
  {{#resume.meta}}
  {{#if accent.length}}
  <style>
    :root {
      --accent: {{accent}};
    }
  </style>
  {{/if}}
  {{/resume.meta}}

	<link href='http://fonts.googleapis.com/css?family=Open+Sans:400,600,700,300' rel='stylesheet' type='text/css'>
	
	</head>
  <body>	
    <div id="resume">
      {{> basics }}
      {{> work }}
      {{> skills }}
      {{> certificates }}
      {{> volunteer }}
      {{> projects }}
      {{> education }}
      {{> awards }}
      {{> publications }}
      {{> languages }}
      {{> interests }}
      {{> references }}
    </div>
	</body>
</html>`;
