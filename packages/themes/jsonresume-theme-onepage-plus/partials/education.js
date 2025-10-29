export default `{{#if resume.education.length}}
<div class='sectionLine'></div>
<div id='education' class="sectionBlock">
	<div class='sectionName'>
		<span>EDUCATION</span>
	</div>
	<div class='sectionContent'>
		{{#each resume.education}}
		<div class='educationBlock'>
			<span class='title'>
				{{#if institution}}{{institution}}{{/if}}
			</span>
			{{#if startDate}}
			<span class='date'>
				{{#if startDate}}{{startDate}}{{/if}} &mdash; {{#if endDate}}{{endDate}}{{else}}Present{{/if}}
			</span>
			{{/if}}
			<div class=''>
				{{#if studyType}}{{studyType}} {{/if}} - {{#if area}}{{area}}{{/if}}{{#if gpa}}, GPA: {{gpa}}{{/if}}
			</div>
		
		</div>
		{{#unless @last}}<div class='separator'></div>{{/unless}}
		{{/each}}
	</div>
</div>
{{/if}}`;
