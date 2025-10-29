export default `	<section id="volunteer" class="row">
		<aside class="col-sm-3">
			<h3>Volunteer</h3>
		</aside>
		<div class="col-sm-9">
			<div class="row">
			{{#each resume.volunteer}}
			<div class="col-sm-12">
				<h4 class="strike-through">
					<span>{{organization}}</span>
					<span class="date">
						{{startDate}} — {{endDate}}
					</span>
				</h4>
				{{#website}}
				<div class="website pull-right">
					<a href="{{.}}">{{.}}</a>
				</div>
				{{/website}}
				{{#position}}
				<div class="position">
					{{.}}
				</div>
				{{/position}}
				{{#summary}}
				<div class="summary">
					<p>{{.}}</p>
				</div>
				{{/summary}}
				{{#if highlights.length}}
				<h4>Highlights</h4>
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
	
	{{#if resume.education.length}}`;
