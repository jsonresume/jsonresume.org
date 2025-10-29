export default `{{#if resume.publications.length}}
<section id="publications" class="publications">
  {{#each resume.publications}}
  <div class="item">
    {{#if @first}}
    <h2>Publications</h2>
    {{/if}}
    {{#if name}}
    <div class="name">{{name}}</div>
    {{/if}}
    {{#if publisher}}
    <div class="subhead">

    <div class="publisher">{{publisher}}</div>
    {{/if}}
    {{#if releaseDate}}
    <small class="releaseDate">{{date releaseDate}}</small>
    {{/if}}
    {{#if url}}
    <div class="website"><a href="{{url}}" target="external">Link</a></div>
    </div>
    {{/if}}
    {{#if summary}}
    <div class="summary">{{summary}}</div>
    {{/if}}
  </div>
  {{/each}}
</section>
{{/if}}`;
