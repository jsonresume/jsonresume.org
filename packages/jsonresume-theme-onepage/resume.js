export default `<!doctype html>
<html>
	<head>

	<meta charset='utf-8'>
	<meta name='viewport' content='width=device-width, user-scalable=no, minimal-ui'>

	<title>{{resume.basics.name}}</title>

	<style>
	{{{css}}}
	</style>

	</head>
	<body>

	<div id='resume'>
	{{#resume.basics}}
  <div id='nameBlock' class='largeFont'>
    <span class='name'>
      {{name}}{{#if label}},{{/if}}
    </span>
    {{#if label}}
    <span class='label'>{{label}}</span>
    {{/if}}
  </div>
  <div id='basicsBlock' class='smallFont'>
    <div class='contactBlock'>
      {{#if email}}
      <span class='email'>{{email}}</span>
      {{/if}}
      {{#if phone}}
      <span class='divider'>|</span>
      <span class='phone'>{{phone}}</span>
      {{/if}}
      {{#location}}
        <span class='divider'>|</span>
        <span class='address'>
          {{#if city}}{{city}}{{/if}}{{#if region}}, {{region}}{{/if}}{{#if countryCode}}, {{countryCode}}{{/if}}
        </span>
      {{/location}}
    </div>
    {{#if profiles.length}}
      <div id='profilesBlock'>
        {{#each profiles}}
          {{#if url}}
            <span class='url'>
              <a href='{{url}}'>{{network}}</a>
            </span>
            {{#unless @last}}<span class='divider'>|</span>{{/unless}}
          {{/if}}
      {{/each}}
      </div>
    {{/if}}
  </div>
  <div class='sectionLine'></div>
	{{/resume.basics}}

  {{#if resume.basics.summary}}
  <div id='summaryBlock' class="sectionBlock">
    <div class='sectionName'>
      <span>SUMMARY</span>
    </div>
    <div class='sectionContent'>
      <span>{{resume.basics.summary}}</span>
    </div>
  </div>
  <div class='sectionLine'></div>
  {{/if}}

	{{#if resume.work.length}}
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

	{{#if resume.publications.length}}
	<div id='publications'>
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

	{{#if resume.awards.length}}
	<div id='awards' class="sectionBlock">
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

	{{#if resume.volunteer.length}}
	<div id='volunteer' class="sectionBlock">
    <div class='sectionName'>
      <span>VOLUNTEERING</span>
    </div>
    <div class='sectionContent'>
      {{#each resume.volunteer}}
      <div class='blockHeader'>
        <span class='title'>{{#if organization}}{{organization}}{{/if}}{{#if position}} - {{position}}{{/if}}</span>
        {{#if startDate}}
        <span class='date'>
          {{#if startDate}}{{startDate}}{{/if}} &mdash; {{#if endDate}}{{endDate}}{{else}}Present{{/if}}
        </span>
        {{/if}}
        {{#if website}}
        <div class='website'><a href='{{website}}'>{{website}}</a></div>
        {{/if}}
        {{#if highlights.length}}
        <ul class='highlights'>
          {{#each highlights}}
          <li>{{.}}</li>
          {{/each}}
        </ul>
        {{/if}}
      </div>
      {{#unless @last}}<div class='separator'></div>{{/unless}}
      {{/each}}
    </div>
	</div>
  <div class='sectionLine'></div>
	{{/if}}

	{{#if resume.education.length}}
	<div id='education' class="sectionBlock">
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

	{{#if resume.skills.length}}
	<div id='skills' class="sectionBlock">
    <div class='sectionName'>
      <span>SKILLS</span>
    </div>
    <div class='sectionContent'>
      {{#each resume.skills}}
      <div class='skillBlock'>
        <span class='title'>{{#if name}}{{name}}{{/if}}{{#if level}} <em>({{level}})</em>{{/if}}:</span>
        {{#if keywords.length}}
          {{#each keywords}}
          <span>{{.}}</span>{{#unless @last}}, {{/unless}}
          {{/each}}
        {{/if}}
        {{#if details.length}}
          {{#each details}}
          <span>{{#if text}}{{text}}{{/if}}{{#if comment}} <em>({{comment}})</em>{{/if}}{{#unless @last}}, {{/unless}}</span>
          {{/each}}
        {{/if}}
      </div>
      {{/each}}
    </div>
	</div>
  <div class='sectionLine'></div>
	{{/if}}

	{{#if resume.languages.length}}
	<div id='languages' class="sectionBlock">
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

	{{#if resume.interests.length}}
	<div id='interests' class="sectionBlock">
    <div class='sectionName'>
      <span>INTERESTS</span>
    </div>
    <div class='sectionContent'>
      {{#each resume.interests}}
      <span class='name'>{{name}}</span><!--
      {{#if keywords.length}}
      --><span class='keywords'> <em>[
      {{#each keywords}}
        {{.}}<!--
        -->{{#unless @last}}, {{/unless}}
      {{/each}}
      ]</em></span><!--
      {{/if}}
      -->{{#unless @last}}<span>, </span>{{/unless}}
      {{/each}}
    </div>
    <div class='sectionLine'></div>
	</div>
  {{/if}}

	</body>
</html>`;
