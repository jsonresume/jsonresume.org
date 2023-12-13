export default `{{#if resume.work.length}}
<div class='sectionLine'></div>
<div id='workBlock' class="sectionBlock">
	<div class='sectionName'>
		<span>EXPERIENCE</span>
	</div>
	<div class='sectionContent'>
		{{#each resume.work}}
		<div class="jobBlock">
			<div class='blockHeader'>
				<span class='title'>{{#if name}}{{name}}{{/if}}</span>
				{{#if position}} | <span class="position">{{position}}</span>{{/if}}
				{{#if startDate}}
				<span class='date'>
					{{#if startDate}}{{startDate}}{{/if}} &mdash; {{#if endDate}}{{endDate}}{{else}}Present{{/if}}
				</span>
				{{/if}}
			</div>
			<div><a href='{{url}}'>{{url}}</a></div>
			{{#if summary}}
			<div class="summary">
				<p>{{summary}}</p>
			</div>
			{{/if}}
			{{#if highlights.length}}
			<ul class='highlights'>
				{{#each highlights}}
				<li>{{.}}</li>
				{{/each}}
			</ul>
			{{/if}}
			{{#unless @last}}<div class='separator'></div>{{/unless}}
		</div>
		{{/each}}
	</div>
</div>
{{/if}}`;
