export default `{{#if resume.projects.length}}
<div class='sectionLine'></div>
<div id='projectsBlock' class="sectionBlock">
	<div class='sectionName'>
		<span>PROJECTS</span>
	</div>
	<div class='sectionContent'>
		{{#each resume.projects}}
		<div class="projectBlock">
			<div class='blockHeader'>
				<span class='title'>
					{{#if name}}{{name}}{{/if}}
				</span>
				{{#if entity}} | <span class="entity">{{entity}}</span>{{/if}}
				{{#if roles.length}} | <span class="roles">{{#each roles}}{{.}}{{#unless @last}}, {{/unless}}{{/each}}</span>{{/if}}
				{{#if startDate}}
				<span class='date'>
					{{#if startDate}}{{startDate}}{{/if}} &mdash; {{#if endDate}}{{endDate}}{{else}}Present{{/if}}
				</span>
				{{/if}}
			</div>
			<div><a href='{{url}}'>{{url}}</a></div>
			{{#if description}}
			<div class="description">
				<p>{{description}}</p>
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
