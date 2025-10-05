export default `	<section id="publications" class="row">
		<aside class="col-sm-3">
			<h3>Publications</h3>
		</aside>
		<div class="col-sm-9">
			<div class="row">
			{{#each resume.publications}}
			<div class="col-sm-12">
				<h4 class="strike-through">
					<span>{{name}}</span>
					<span class="date">
						{{releaseDate}}
					</span>
				</h4>
				{{#website}}
				<div class="website pull-right">
					<a href="{{.}}"></a>
				</div>
				{{/website}}
				{{#publisher}}
				<div class="publisher">
					<em>Published by</em>
					<strong>{{.}}</strong>
				</div>
				{{/publisher}}
				{{#summary}}
				<div class="summary">
					<p>{{.}}</p>
				</div>
				{{/summary}}
			</div>
			{{/each}}
			</div>
		</div>
	</section>
	{{/if}}
	
	{{#if resume.skills.length}}`;
