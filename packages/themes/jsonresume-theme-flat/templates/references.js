export default `	<section id="references" class="row">
		<aside class="col-sm-3">
			<h3>References</h3>
		</aside>
		<div class="col-sm-9">
			<div class="row">
			{{#each resume.references}}
			<div class="col-sm-12">
				{{#if reference}}
				<blockquote class="reference">
					<p>{{reference}}</p>
					{{#name}}
					<p class="name">
						<strong>— {{.}}</strong>
					</p>
					{{/name}}
				</blockquote>
				{{/if}}
			</div>
			{{/each}}
			</div>
		</div>
	</section>
	{{/if}}

	</div>
	
	</body>
</html>\`;`;
