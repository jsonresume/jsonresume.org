export default `{{#if resume.interests.length}}
<div class='sectionLine'></div>
<div id='interests' class="sectionBlock">
	<div class='sectionName'>
		<span>INTERESTS</span>
	</div>
	<div class='sectionContent'>
		{{#each resume.interests}}
		<span class='name'>{{name}}</span>
		<!--
      {{#if keywords.length}}
      --><span class='keywords'> <em>[
				{{#each keywords}}
				{{.}}
				<!--
        -->{{#unless @last}}, {{/unless}}
				{{/each}}
				]
			</em></span>
		<!--
      {{/if}}
      -->{{#unless @last}}<span>, </span>{{/unless}}
		{{/each}}
	</div>
</div>
{{/if}}`;
