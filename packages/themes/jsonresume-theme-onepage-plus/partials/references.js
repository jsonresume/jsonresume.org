export default `{{#if resume.references.length}}
<div class='sectionLine'></div>
<div id="references">
	<div class='sectionName'>
		<span>REFERENCES</span>
	</div>
	<div class="sectionContent">
		{{#each resume.references}}
		{{#if reference}}
		<blockquote class="reference">
			{{reference}}
		
		{{/if}}
		{{#if name}}
		<div class="name">
			— {{name}}
		</div>
		{{/if}}
		</blockquote>
		{{/each}}
	</div>
</div>
{{/if}}`;
