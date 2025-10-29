export default `{{#if resume.languages.length}}
<section id="languages" class="languages">
  {{#each resume.languages}}
  <div class="item">
    {{#if @first}}
    <h2>Languages</h2>
    {{/if}}
    {{#if language}}
    <div class="language-item">
      <span class="language">{{language}}:</span>
      {{/if}}
      {{#if fluency}}
      <span class="fluency">{{fluency}}</span>
      {{/if}}
    </div>
  </div>
  {{/each}}
</section>
{{/if}}`;
