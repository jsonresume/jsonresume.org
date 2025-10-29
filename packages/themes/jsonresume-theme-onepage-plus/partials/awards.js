export default `{{#if resume.awards.length}}
<div class='sectionLine'></div>
<div id='awards' class="sectionBlock">
	<div class='sectionName'>
		<span>AWARDS</span>
	</div>
	<div class='sectionContent'>
		{{#each resume.awards}}
		<div class='blockHeader'>
			<span class='title'>
				{{#if title}}{{title}}{{/if}}
			</span>
			{{#if date}}
			<span class='date'>
				<span class='date'>{{date}}</span>
			</span>
			{{/if}}
		</div>
		{{#if awarder}}
			<div class="awarder">{{awarder}}</div>
		{{/if}}
		{{#if summary}}
		<div class="summary">
			<p>{{summary}}</p>
		</div>
		{{/if}}
		{{#unless @last}}<div class='separator'></div>{{/unless}}
		{{/each}}
	</div>
</div>
{{/if}}`;
