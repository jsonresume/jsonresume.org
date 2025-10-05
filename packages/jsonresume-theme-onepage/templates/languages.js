export default `	<div id='languages' class="sectionBlock">
    <div class='sectionName'>
      <span>LANGUAGES</span>
    </div>
    <div class='sectionContent'>
      {{#each resume.languages}}
      <span class='language'>{{language}}</span>
      {{#if fluency}}
      <span class='fluency'><em>({{fluency}})</em></span>
      {{/if}}
      {{#unless @last}}<span>,</span>{{/unless}}
      {{/each}}
    </div>
    <div class='sectionLine'></div>
	</div>
  {{/if}}

	{{#if resume.interests.length}}`;
