export default `	<section id="projects" class="row">
		<aside class="col-sm-3">
			<h3>Projects</h3>
		</aside>
		<div class="col-sm-9">
			<div class="row">
			{{#each resume.projects}}
			<div class="col-sm-12">
				<h4 class="strike-through">
					<span>{{name}}</span>
					{{#if startDate}}
					<span class="date">
						{{startDate}} — {{endDate}}
					</span>
					{{/if}}
				</h4>
				{{#url}}
				<div class="website pull-right">
					<a href="{{.}}">{{.}}</a>
				</div>
				{{/url}}
				{{#description}}
				<div class="summary">
					<p>{{.}}</p>
				</div>
				{{/description}}
				{{#if highlights.length}}
				<ul class="highlights">
					{{#highlights}}
					<li class="bullet">{{.}}</li>
					{{/highlights}}
				</ul>
				{{/if}}
			</div>
			{{/each}}
			</div>
		</div>
	</section>
	{{/if}}

	{{#if resume.skills.length}}`;
