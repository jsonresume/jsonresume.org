export default `	<div id='education' class="sectionBlock">
    <div class='sectionName'>
      <span>EDUCATION</span>
    </div>
    <div class='sectionContent'>
      {{#each resume.education}}
      <div class='educationBlock'>
        <span class='title'>
          {{#if institution}}{{institution}}{{/if}}
        </span>
        {{#if startDate}}
        <span class='date'>
          {{#if startDate}}{{startDate}}{{/if}} &mdash; {{#if endDate}}{{endDate}}{{else}}Present{{/if}}
        </span>
        {{/if}}
        <div class=''>
          {{#if studyType}}{{studyType}} {{/if}} - {{#if area}}{{area}}{{/if}}{{#if gpa}}, GPA: {{gpa}}{{/if}}
        </div>
        {{#if courses.length}}
        <div id='coursesBlock'>
          {{#each courses}}
          <ul class='coursesList'>
            {{#each .}}
            <li class='course'>{{.}}</li>
            {{/each}}
          </ul>
          {{/each}}
        </div>
        {{/if}}
      </div>
      {{#unless @last}}<div class='separator'></div>{{/unless}}
      {{/each}}
    </div>
	</div>
  <div class='sectionLine'></div>
	{{/if}}

	{{#if resume.skills.length}}`;
