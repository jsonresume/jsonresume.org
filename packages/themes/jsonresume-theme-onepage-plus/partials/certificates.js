export default `{{#if resume.certificates.length}}
<div class='sectionLine'></div>
<div id='certificates'>
	<div class='sectionName'>
		<span>CERTIFICATES</span>
	</div>
	<div class='sectionContent'>
		{{#each resume.certificates}}
		<div class='blockHeader'>
			<span class='title'>
				{{#if name}}{{name}}{{/if}}
			</span>
			{{#if issuer}} | <span class="issuer">{{issuer}}</span>{{/if}}
			{{#if date}}
			<span class='date'>
				<span class='date'>{{formatDate date}}</span>
			</span>
			{{/if}}
		</div>
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
