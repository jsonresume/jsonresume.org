export default `{{#if resume.interests.length}}
<section id="interests" class="interests">
  {{#each resume.interests}}
  <div class="item">
    {{#if @first}}
    <h2>Interests</h2>
    {{/if}}
    {{#if name}}
    <span class="name">{{name}}:</span>
    {{/if}}
    {{#if keywords.length}}
    <span class="keywords">
      {{#each keywords}}
      <span>{{.}}</span>{{#if @last}}{{else}},{{/if}}
      {{/each}}
    </span>
    {{/if}}
  </div>
  {{/each}}
</section>
{{/if}}`;
