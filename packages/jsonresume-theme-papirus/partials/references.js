export default `{{#if resume.references.length}}
<section class="section-references">
	{{>title title='References'}}
	{{#each resume.references}}
	<div class="item">
		{{#if reference}}
		<blockquote class="reference">
			{{reference}}
		</blockquote>
		{{/if}}
		{{#if name}}
		<div class="name">
			— {{name}}
		</div>
		{{/if}}
	</div>
	{{/each}}
</section>
{{/if}}`;
