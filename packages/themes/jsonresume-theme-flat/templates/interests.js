export default `	<section id="interests" class="row">
		<aside class="col-sm-3">
			<h3>Interests</h3>
		</aside>
		<div class="col-sm-9">
			<div class="row">
			{{#each resume.interests}}
			<div class="col-sm-6">
				{{#name}}
				<div class="name">
					<h4>{{.}}</h4>
				</div>
				{{/name}}
				{{#if keywords.length}}
				<ul class="keywords">
					{{#keywords}}
					<li>{{.}}</li>
					{{/keywords}}
				</ul>
				{{/if}}
			</div>
			{{/each}}
			</div>
		</div>
	</section>
	{{/if}}
	
	{{#if resume.references.length}}`;
