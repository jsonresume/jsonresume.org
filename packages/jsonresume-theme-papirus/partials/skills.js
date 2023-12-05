export default `{{#if resume.skills.length}}
<section class="section-skills">
	{{>title title='Skills'}}
	{{#each resume.skills}}
	<div class="item">
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
	</div>
	{{/each}}
</section>
{{/if}}`;
