export default `{{#if resume.projects.length}}
<section id="projects" class="projects">
  {{#each resume.projects}}
  <section class="item">
    {{#if @first}}
    <h2>Projects</h2>
    {{/if}}
    <header>
      {{#if name}}
      <h3 class="name">{{name}}</h3>
      {{/if}}
      {{#if startDate}}
      <small class="subhead">{{date startDate}}
      {{/if}}
      {{#if endDate}}
       - {{date endDate}}</small>
      {{else}}
       - Present</small>
      {{/if}}
    </header>
    {{#if summary}}
    <div class="summary">{{paragraphSplit summary}}</div>
    {{/if}}
    {{#if highlights.length}}
    <strong>Highlights</strong>
    <ul class="highlights">
      {{#each highlights}}
      <li>{{.}}</li>
      {{/each}}
    </ul>
    {{/if}}
    {{#if keywords.length}}
    <strong>Keywords</strong>
    <ul class="keywords">
      {{#each keywords}}
      <li>{{.}}</li>
      {{/each}}
    </ul>
    {{/if}}
    {{#if roles.length}}
      <strong>Roles</strong>
    <ul class="roles">
      {{#each roles}}
      <li>{{.}}</li>
      {{/each}}
    </ul>
    {{/if}}
    {{#if entity}}
      <div class="entity">{{entity}}</div>
    {{/if}}
    {{#if type}}
      <div class="type">{{type}}</div>
    {{/if}}
  </section>
  {{/each}}
</section>
{{/if}}`;
