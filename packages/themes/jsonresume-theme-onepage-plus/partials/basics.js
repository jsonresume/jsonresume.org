export default `{{#resume.basics}}
<div id='nameBlock' class='largeFont'>
	<span class='name'>
		{{name}}{{#if label}},{{/if}}
	</span>
	{{#if label}}
	<span class='label'>{{label}}</span>
	{{/if}}
</div>
<div id='basicsBlock' class='smallFont'>
	<div class='contactBlock'>
		{{#if email}}
		<span class='email'>{{email}}</span>
		{{/if}}
		{{#if phone}}
		<span class='divider'>|</span>
		<span class='phone'>{{phone}}</span>
		{{/if}}
		{{#location}}
		<span class='divider'>|</span>
		<span class='address'>
			{{#if city}}{{city}}{{/if}}{{#if region}}, {{region}}{{/if}}{{#if countryCode}}, {{countryCode}}{{/if}}
		</span>
		{{/location}}
	</div>
	{{#if profiles.length}}
	<div id='profilesBlock'>
		{{#each profiles}}
		{{#if url}}
		<span class='url'>
			<b>{{network}}:</b> <a href='{{url}}'>{{url}}</a>
		</span>
		{{#unless @last}}<span class='divider'>|</span>{{/unless}}
		{{/if}}
		{{/each}}
	</div>
	{{/if}}
</div>
{{/resume.basics}}

{{#if resume.basics.summary}}
<div class='sectionLine'></div>
<div id='summaryBlock' class="sectionBlock">
	<div class='sectionName'>
		<span>SUMMARY</span>
	</div>
	<div class='sectionContent'>
		<span>{{resume.basics.summary}}</span>
	</div>
</div>
{{/if}}`;
