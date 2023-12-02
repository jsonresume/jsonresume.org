export default `{{#if resume.awards.length}}
<section class="section-awards">
	{{>title title='Awards'}}
	<ul>
		{{#each resume.awards}}
		<li class="item">
			{{#if title}}
			<div class="title">
				{{title}}
				{{#if date}}
				<span class="date">
					| {{formatDate date}}
				</span>
				{{/if}}
				{{#if awarder}}
				<span class="awarder">
					| {{awarder}}
				</span>
				{{/if}}
			</div>
			{{/if}}
			{{#if summary}}
			<div class="summary">
				<p>{{summary}}</p>
			</div>
			{{/if}}
		</li>
		{{/each}}
	</ul>
</section>
{{/if}}`;