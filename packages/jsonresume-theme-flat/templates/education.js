export default `	<section id="education" class="row">
		<aside class="col-sm-3">
			<h3>Education</h3>
		</aside>
		<div class="col-sm-9">
			<div class="row">
			{{#each resume.education}}
			<div class="col-sm-12">
				<h4 class="strike-through">
					<span>{{institution}}</span>
					<span class="date">
						{{startDate}} — {{endDate}}
					</span>
				</h4>
				{{#area}}
				<div class="area">
					{{.}}
				</div>
				{{/area}}
				{{#studyType}}
				<div class="studyType">
					{{.}}
				</div>
				{{/studyType}}
				{{#if courses.length}}
				<h4>Courses</h4>
				<ul class="courses">
					{{#courses}}
					<li>{{.}}</li>
					{{/courses}}
				</ul>
				{{/if}}
			</div>
			{{/each}}
			</div>
		</div>
	</section>
	{{/if}}
	
	{{#if resume.awards.length}}`;
