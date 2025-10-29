export default `{{#if resume.awards.length}}
<section id="awards" class="awards">
  {{#each resume.awards}}
  <div class="item">
    {{#if @first}}
    <h2>Awards</h2>
    {{/if}}
    <header>
      {{#if title}}
      <div class="title">{{title}}</div>
      {{/if}}
      {{#if date}}
      <small class="date">{{date date}}</small>
      {{/if}}
    </header>
    {{#if awarder}}
    <div class="awarder">{{awarder}}</div>
    {{/if}}
    {{#if summary}}
    <div class="summary"><span>{{summary}}</span></div>
    {{/if}}
  </div>
  {{/each}}
</section>
{{/if}}`;
