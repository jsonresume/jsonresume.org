export default `	<div id='awards' class="sectionBlock">
    <div class='sectionName'>
      <span>AWARDS</span>
    </div>
    <div class='sectionContent'>
      {{#each resume.awards}}
      <div class='blockHeader'>
        <span class='title'>
          {{#if title}}{{title}}{{/if}}{{#if awarder}}, {{awarder}}{{/if}}
        </span>
        {{#if date}}
        <span class='date'>
          <span class='date'>{{date}}</span>
        </span>
        {{/if}}
      </div>
      {{#if highlights.length}}
      <ul class='highlights'>
        {{#each highlights}}
        <li>{{.}}</li>
        {{/each}}
      </ul>
      {{/if}}
      {{#unless @last}}<div class='separator'></div>{{/unless}}
      {{/each}}
    </div>
	</div>
  <div class='sectionLine'></div>
	{{/if}}

	{{#if resume.volunteer.length}}`;
