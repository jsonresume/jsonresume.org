export default `	<section id="certificates" class="row">
		<aside class="col-sm-3">
			<h3>Certificates</h3>
		</aside>
		<div class="col-sm-9">
			<div class="row">
			{{#each resume.certificates}}
			<div class="col-sm-12">
				<h4 class="strike-through">
					<span>{{name}}</span>
					{{#date}}
					<span class="date">
						{{.}}
					</span>
					{{/date}}
				</h4>
				{{#url}}
				<div class="website pull-right">
					<a href="{{.}}">{{.}}</a>
				</div>
				{{/url}}
				{{#issuer}}
				<div class="issuer">
					<em>Issued by</em>
					<strong>{{.}}</strong>
				</div>
				{{/issuer}}
			</div>
			{{/each}}
			</div>
		</div>
	</section>
	{{/if}}

	{{#if resume.publications.length}}`;
