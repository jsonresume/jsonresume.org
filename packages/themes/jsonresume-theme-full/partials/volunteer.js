export default `{{#if resume.volunteer.length}}
<section id="volunteering" class="volunteering">
  {{#each resume.volunteer}}
  <div class="item">
    {{#if @first}}
    <h2>Volunteering</h2>
    {{/if}}
    <header>
      {{#if organization}}
      <h3 class="name">{{organization}}</h3>
      {{/if}}
      <div class="subhead">
        {{#if position}}
        <span class="position">{{position}}</span>
        {{/if}}
        {{#if startDate}}
        <small class="startDate">{{date startDate}}
        {{/if}}
        {{#if endDate}}
        - {{date endDate}}</small>
        {{else}}
        - Present</small>
        {{/if}}
      </div>
    </header>
    {{#if summary}}
    <div class="summary">{{summary}}</div>
    {{/if}}
    {{#if highlights.length}}
    <ul class="highlights">
      {{#each highlights}}
      <li>{{.}}</li>
      {{/each}}
    </ul>
    {{/if}}
  </div>
  {{/each}}
</section>
{{/if}}`;
