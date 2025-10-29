export default `{{#if resume.skills.length}}
<section id="skills" class="skills">
  {{#each resume.skills}}
  <div class="item">
    {{#if @first}}
    <h2>Skills</h2>
    {{/if}}
    {{#if name}}
    <div class="name">{{name}}</div>
    {{/if}}
    {{#if keywords.length}}
    <div class="keywords">
      {{#each keywords}}
      {{.}}{{#if @last}}{{else}},{{/if}}
      {{/each}}
    </div>
    {{/if}}
  </div>
  {{/each}}
</section>
{{/if}}`;
