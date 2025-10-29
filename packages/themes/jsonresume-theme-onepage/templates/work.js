export default `	{{#if resume.work.length}}
  <div id='workBlock' class="sectionBlock">
    <div class='sectionName'>
      <span>EXPERIENCE</span>
    </div>
    <div class='sectionContent'>
      {{#each resume.work}}
			<div class="jobBlock">
	      <div class='blockHeader'>
	        <span class='title'>
	          {{#if company}}{{company}}{{/if}}{{#if position}} - {{position}}{{/if}}
	        </span>
	        {{#if startDate}}
	        <span class='date'>
	          {{#if startDate}}{{startDate}}{{/if}} &mdash; {{#if endDate}}{{endDate}}{{else}}Present{{/if}}
	        </span>
	        {{/if}}
	      </div>
	      <div><a href='{{website}}'>{{website}}</a></div>
	      {{#if highlights.length}}
	      <ul class='highlights'>
	        {{#each highlights}}
	        <li>{{.}}</li>
	        {{/each}}
	      </ul>
	      {{/if}}
	      {{#if details.length}}
	      <ul class='details'>
	        {{#each details}}
	        <li>{{#if text}}{{text}}{{/if}}{{#if comment}} <em>[{{comment}}]</em>{{/if}}</li>
	        {{/each}}
	      </ul>
	      {{/if}}
	      {{#unless @last}}<div class='separator'></div>{{/unless}}
			</div>
      {{/each}}
    </div>
  </div>
  <div class='sectionLine'></div>
	{{/if}}

	{{#if resume.publications.length}}`;
