export default `{{#if resume.references.length}}
<section id="references" class="references">
  {{#each resume.references}}
  <div class="item">
    {{#if @first}}
    <h2>References</h2>
    {{/if}}
    {{#if reference}}
    <blockquote class="reference">{{reference}}</blockquote>
    {{/if}}
    {{#if name}}
    <div class="name">— {{name}}</div>
    {{/if}}
  </div>
  {{/each}}
</section>
{{/if}}`;
