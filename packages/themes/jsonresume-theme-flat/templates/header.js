export default `	<header id="header">
		<div class="container">
			<div class="row">
				<div class="col-sm-9 col-sm-push-3">
					{{#resume.basics}}
					{{#name}}
					<h1>
						{{.}}
					</h1>
					{{/name}}
					{{#label}}
					<h2>
						{{.}}
					</h2>
					{{/label}}
					{{/resume.basics}}
				</div>
			</div>
		</div>
	</header>`;
