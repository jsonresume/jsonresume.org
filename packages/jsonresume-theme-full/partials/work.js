export default `{{#if resume.work.length}}
<section id="experience" class="experience">
  {{#each resume.work}}
  <section class="item">
    {{#if @first}}
    <h2>Experience</h2>
    {{/if}}
    <header>
      {{#if url}}
      <h3 class="name"><a href="{{url}}" target="external">{{name}}</a></h3>
      {{else}}
      <h3 class="name">{{name}}</h3>
      {{/if}}
      <div class="subhead">
      {{#if position}}
      <span class="position">{{position}}</span>
      {{/if}}
      {{#if noDate}}
        <small>N/A</small>
      {{else}}
        {{#if startDate}}
            <small class="dates">{{date startDate}}
        {{/if}}
        {{#if endDate}}
            - {{date endDate}}</small>
        {{else}}
        - Present</small>
        {{/if}}
      {{/if}}
      </div>
    </header>
    {{#if summary}}
    <div class="summary">{{paragraphSplit summary}}</div>
    {{/if}}
    {{#if highlights.length}}
    <ul class="highlights">
      {{#each highlights}}
      <li>{{.}}</li>
      {{/each}}
    </ul>
    {{/if}}
  </section>
  {{/each}}
</section>
{{/if}}`;
