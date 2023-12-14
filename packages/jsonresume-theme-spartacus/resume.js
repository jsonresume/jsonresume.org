export default `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>{{#resume.basics}}{{name}}{{/resume.basics}}</title>
  <link href="http://fonts.googleapis.com/css?family=Open+Sans:300,700|Roboto:300,400,700|Noto+Serif:400" rel="stylesheet" type="text/css">
  <style>
    {{{css}}}
  </style>
</head>

<body>
  <div id='resume-container'>
    {{#resume.basics}}
    <div class='header card'>
      <h1 id='name'>
          {{name}}
        </h1>
      <span class='term'>{{label}}</span>
    </div>
    {{/resume.basics}}
    <div class='left-content'>
      {{#resume.basics}}
      <section class='card'>
        <div class='section-header'>Contact</div>
        <div class='section-content' id='contact'>
          <div class='contact'>
            {{#location}}
            <div class='address'>
              {{#if city}}{{city}}{{/if}}{{#if region}}, {{region}}{{/if}}{{#if countryCode}}, {{countryCode}}{{/if}}
            </div>
            {{/location}}
            <div class='email'>
              <a href='mailto:{{email}}'>{{email}}</a>
            </div>
            {{#if profiles.length}} {{#each profiles}} {{#if url}}
            <div class='site'>
              {{network}}: <a href='{{url}}'>{{username}}</a>
            </div>
            {{/if}} {{/each}} {{/if}}
            <div class='phone-number last'>
              <a href="tel:{{phone}}">{{phone}}</a>
            </div>
          </div>
        </div>
      </section>
      {{/resume.basics}} {{#if resume.skills.length}}
      <section class='card'>
        <div class='section-header'>Technical Skills</div>
        <div class='section-content' id='technical-skills'>
          <div id='skills-container'>
            {{#each resume.skills}}
            <div class='skills'>
              {{#if name}}
              <div class='skill'>{{name}}</div>
              {{/if}} {{#if level}}
              <div class="level">
                <em>{{level}}</em>
              </div>
              {{/if}} {{#if keywords.length}}
              <p>
                {{#each keywords}} {{.}}{{#unless @last}},{{/unless}} {{/each}}
              </p>
              {{/if}}
            </div>
            {{/each}}
          </div>
        </div>
      </section>
      {{/if}} {{#if resume.education.length}}
      <section class='card'>
        <div class='section-header'>Education</div>
        <div class='section-content' id='education'>
          {{#each resume.education}}
          <div class='education last'>
            <div class='education-info'>
              <div class='title'>
                {{#if studyType}}{{studyType}}{{/if}} in {{#if area}}{{area}}{{/if}}
                <br>at {{#if institution}} {{institution}} {{/if}}
              </div>
              <div class='duration'>
                {{#if startDate}} {{prettifyDate startDate}} {{/if}} {{#if endDate}} - {{prettifyDate endDate}} {{else}} - Present {{/if}}
              </div>
            </div>
            {{#if gpa}}
            <div class='grade'>Grade: {{gpa}}</div>{{/if}}
          </div>
          {{/each}}
        </div>
      </section>
      {{/if}} {{#if resume.awards.length}}
      <section class='card'>
        <div class='section-header'>Awards</div>
        <div class='section-content' id='awards'>
          {{#each resume.awards}}
          <div class='awards last'>
            <div class='awards-info'>
              <div class='title'>
                {{#if title}}{{title}}{{/if}} {{#if awarder}}<br/>{{awarder}}{{/if}}
              </div>
              {{#if summary}}
              <div class='summary'>
                {{summary}}
              </div>
              {{/if}}
              <div class='duration'>
                {{#if date}} {{prettifyDate date}} {{/if}}
              </div>
            </div>
          </div>
          {{/each}}
        </div>
      </section>
      {{/if}}
    </div>
    <div class='right-content'>
      {{#if resume.basics.summary}}
      <section class='card'>
        <div class='section-header'>Summary</div>
        <div class='section-content' id='summary'>
          {{{resume.basics.summary}}}
        </div>
      </section>
      {{/if}}
      {{#if resume.work.length}}
      <section class='card'>
        <div class='section-header'>Employment</div>
        <div class='section-content' id='employment'>
          {{#each resume.work}}
          <div class='employment'>
            <div class='employment-info'>
              <div class='title'>
                {{#if company}}
                <a href='{{#if website}}{{website}}{{/if}}'>
                  		{{company}}
                  	</a> {{/if}} {{#if position}} {{position}} {{/if}}
              </div>
              <div class='duration'>
                {{#if startDate}} {{prettifyDate startDate}} {{/if}} {{#if endDate}} - {{prettifyDate endDate}} {{else}} - Present {{/if}}
              </div>
            </div>
            <div class='info'>
              {{#if summary}}
              <div class="summary">
                {{summary}}
              </div>
              {{/if}} {{#if highlights.length}}
              <ul class="list">
                {{#each highlights}}
                <li>{{.}}</li>
                {{/each}}
              </ul>
              {{/if}}
            </div>
          </div>
          {{/each}}
        </div>
      </section>
      {{/if}} {{#if resume.volunteer.length}}
      <section class='card'>
        <div class='section-header'>Projects</div>
        <div class='section-content' id='projects'>
          {{#each resume.volunteer}}
          <div class='project last'>
            <div class='project-info'>
              <div class='title'>{{#if summary}}{{summary}}{{/if}}</div>
              {{#if website}}<a class='content' href='{{website}}'>{{website}}</a>{{/if}}
            </div>
            <div class='info'>
              {{#if highlights.length}}
              <ul class="list">
                {{#each highlights}}
                <li>{{.}}</li>
                {{/each}}
              </ul>
              {{/if}}
            </div>
          </div>
          {{/each}}
        </div>
      </section>
      {{/if}} {{#if resume.references.length}}
      <section class='card' style="margin-bottom: 48px;">
        <div class='section-header'>References</div>
        <div class='section-content' id='interests'>
          {{#each resume.references}} {{#if reference}}
          <blockquote class="reference">
            {{reference}}
          </blockquote>
          {{/if}} {{#if name}}
          <div class="name">
            — {{name}}
          </div>
          {{/if}} {{/each}}
        </div>
      </section>
      {{/if}}
    </div>
  </div>
</body>

</html>`;
