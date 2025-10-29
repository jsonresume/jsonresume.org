export default `	<div id='publications'>
    <div class='sectionName'>
      <span>PUBLICATIONS</span>
    </div>
    <div class='sectionContent'>
      {{#each resume.publications}}
      <div class='blockHeader'>
        <span class='title'>
          {{#if name}}{{name}}{{/if}}{{#if publisher}}, {{publisher}}{{/if}}
        </span>
        {{#if releaseDate}}
        <span class='date'>
          <span class='releaseDate'>{{releaseDate}}</span>
        </span>
        {{/if}}
      </div>
      {{#if website}}
      <div class='website'>
        <a href='{{website}}'>{{website}}</a>
      </div>
      {{/if}}
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

	{{#if resume.awards.length}}`;
