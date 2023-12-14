export default `{{#if resume.volunteer.length}}
<div class='sectionLine'></div>
<div id='volunteer' class="sectionBlock">
	<div class='sectionName'>
		<span>VOLUNTEERING</span>
	</div>
	<div class='sectionContent'>
		{{#each resume.volunteer}}
		<div class='blockHeader'>
			<span class='title'>{{#if position}}{{position}}{{/if}}</span>{{#if organization}} | {{organization}}{{/if}}
			{{#if startDate}}
			<span class='date'>
				{{#if startDate}}{{startDate}}{{/if}} &mdash; {{#if endDate}}{{endDate}}{{else}}Present{{/if}}
			</span>
			{{/if}}
			{{#if url}}
			<div class='url'><a href='{{url}}'>{{url}}</a></div>
			{{/if}}
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
		</div>
		{{#unless @last}}<div class='separator'></div>{{/unless}}
		{{/each}}
	</div>
</div>
{{/if}}`;
