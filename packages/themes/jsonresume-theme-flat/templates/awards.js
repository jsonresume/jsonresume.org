export default `	<section id="awards" class="row">
		<aside class="col-sm-3">
			<h3>Awards</h3>
		</aside>
		<div class="col-sm-9">
			<div class="row">
			{{#each resume.awards}}
			<div class="col-sm-12">
				<h4 class="strike-through">
					<span>{{title}}</span>
				</h4>
				{{#date}}
				<div class="date pull-right">
					<em>Awarded</em>
					{{.}}
				</div>
				{{/date}}
				{{#awarder}}
				<div class="awarder">
					<em>by</em>
					<strong>{{.}}</strong>
				</div>
				{{/awarder}}
				{{#summary}}
				<div class="summary">
					{{.}}
				</div>
				{{/summary}}
			</div>
			{{/each}}
			</div>
		</div>
	</section>
	{{/if}}
	
	{{#if resume.publications.length}}`;
