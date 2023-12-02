export default `{{#if resume.languages.length}}
<section class="section-languages">
	{{>title title='Languages'}}
	<ul>
		{{#each resume.languages}}
		<li class="item">
			{{#if language}}
			<div class="language">
				{{language}}
				{{#if fluency}}
				<span class="fluency">
					| <em>{{fluency}}</em>
				</span>
				{{/if}}
			</div>
			{{/if}}
		</li>
		{{/each}}
	</ul>
</section>
{{/if}}`;
