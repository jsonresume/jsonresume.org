export default `{{#if resume.interests.length}}
<section class="section-interests">
	{{>title title='Interests'}}
	<ul>
		{{#each resume.interests}}
		<li class="item">
			{{#if name}}
			<div class="name">
				{{name}}
			</div>
			{{#if keywords.length}}
			<div class="keywords">
				{{#each keywords}}
				<span class="label label-default">{{.}}</span>
				{{/each}}
			</div>
			{{/if}}
			{{/if}}
		</li>
		{{/each}}
	<ul>
</section>
{{/if}}`;
