export default `{{#if resume.education.length}}
<section id="education" class="education">
  {{#each resume.education}}
  <div class="item">
    {{#if @first}}
    <h2>Education</h2>
    {{/if}}
    <header>
      {{#if institution}}
        <h3 class="name">{{institution}}</h3>
      {{/if}}
      {{#if noDate}}
      {{else}}
        <small class="dates">
          {{#if startDate}}
          <span class="startDate">{{date startDate}}</span>
          {{/if}}
          {{#if endDate}}
          <span class="endDate"> - {{date endDate}}</span>
          {{else}}
          <span class="endDate"> - Present</span>
          {{/if}}
        </small>
    {{/if}}
    </header>
    <div class="qualification">
      {{#if studyType}}
      <span class="studyType">{{studyType}}</span>
      {{/if}}
      {{#if area}}
      <span class="area">{{area}}</span>
      {{/if}}
      {{#if gpa}}
      <span class="gpa">GPA: {{gpa}}</span>
      {{/if}}
      {{#if score}}
      <span class="gpa">GPA: {{score}}</span>
      {{/if}}
      {{#if courses.length}}
      <br>
      <strong>Courses</strong>
      <ul class="courses">
        {{#each courses}}
        <li>{{.}}</li>
        {{/each}}
      </ul>
      {{/if}}
    </div>
  </div>
  {{/each}}
</section>
{{/if}}`;
