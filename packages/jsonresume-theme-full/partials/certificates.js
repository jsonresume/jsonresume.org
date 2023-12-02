export default `{{#if resume.certificates.length}}
<section id="certificates" class="certificates">
  {{#each resume.certificates}}
  <div class="item">
    {{#if @first}}
    <h2>Certificates</h2>
    {{/if}}
    <header>
      {{#if name}}
        <h3 class="name">{{name}}</h3>
      {{/if}}
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
    </header>
    <div class="issuer_container">
      {{#if issuer}}
      <span class="issuer">{{issuer}}</span>
      {{/if}}
      <span class="url_container">
        {{#if url}}
          {{#if code}}
            <a href="{{url}}" target="external">{{code}}</a>
          {{else}}
            <a href="{{url}}" target="external">{{url}}</a>
          {{/if}}
        {{else}}
        {{code}}
        {{/if}}
      </span>
    </div>
  </div>
  {{/each}}
</section>
{{/if}}`;
