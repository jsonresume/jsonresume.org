export default `{{#if resume.publications.length}}
<div class='sectionLine'></div>
<div id='publications'>
	<div class='sectionName'>
		<span>PUBLICATIONS</span>
	</div>
	<div class='sectionContent'>
		{{#each resume.publications}}
		<div class='blockHeader'>
			<span class='title'>
				{{#if name}}{{name}}{{/if}}
			</span>
			{{#if releaseDate}}
			<span class='date'>
				<span class='releaseDate'>{{formatDate releaseDate}}</span>
			</span>
			{{/if}}
		</div>
		{{#if publisher}}
		<div class="publisher">{{publisher}}</div>
		{{/if}}
		{{#if url}}
		<div class='url'>
			<a href='{{url}}'>{{url}}</a>
		</div>
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
