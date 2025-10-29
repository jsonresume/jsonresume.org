export default `	<div id="content" class="container">

	{{#resume.basics}}
	<section id="contact" class="row">
		<aside class="col-sm-3">
			<h3>Contact</h3>
		</aside>
		<div class="col-sm-9">
			<div class="row">
			{{#email}}
			<div class="col-sm-6">
				<strong>Email</strong>
				<div class="email">{{.}}</div>
			</div>
			{{/email}}
			{{#phone}}
			<div class="col-sm-6">
				<strong>Phone</strong>
				<div class="phone">{{.}}</div>
			</div>
			{{/phone}}
			{{#website}}
			<div class="col-sm-6">
				<strong>Website</strong>
				<div class="website">
					<a href="{{.}}">{{.}}</a>
				</div>
			</div>
			{{/website}}
			</div>
		</div>
	</section>
	<section id="about" class="row">
		<aside class="col-sm-3">
			<h3>About</h3>
		</aside>
		<div class="col-sm-9">
		{{#summary}}
			<p>{{.}}</p>
		{{/summary}}
		</div>
	</section>
	{{#if profiles.length}}
	<section id="profiles" class="row">
		<aside class="col-sm-3">
			<h3>Profiles</h3>
		</aside>
		<div class="col-sm-9">
			<div class="row">
				{{#profiles}}
				<div class="col-sm-6">
					{{#network}}
					<strong class="network">
						{{.}}
					</strong>
					{{/network}}
					{{#if username}}
					<div class="username">
						{{#if url}}
						<div class="url">
							<a href="{{url}}">{{username}}</a>
						</div>
						{{else}}
							{{username}}
						{{/if}}
					</div>
					{{else}}
						{{#if url}}
						<div class="url">
							<a href="{{url}}">{{url}}</a>
						</div>
						{{/if}}
					{{/if}}
				</div>
				{{/profiles}}
			</div>
		</div>
	</section>
	{{/if}}
	{{/resume.basics}}

	{{#if resume.work.length}}`;
