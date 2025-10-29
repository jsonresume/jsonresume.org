export default `{{#resume.basics}}
<section id="heading" class="heading">
  <header>
    <h1>
      {{name}}
    </h1>
    {{#if label}}
    <h2>{{label}}</h2>
    {{/if}}
    {{#if summary}}
    <div class="summary">{{paragraphSplit summary}}</div>
    {{/if}}
    <div class="contact">
      {{#if email}}
      <span class="contact-detail"><a href="mailto:{{email}}">{{email}}</a></span>
      {{/if}}
      {{#if phone}}
      <span class="contact-detail">{{phone}}</span>
      {{/if}}
      {{#if url}}
      <span class="contact-detail"><a href="{{url}}" target="external">{{url}}</a></span>
      {{/if}}
      {{#if location}}
    </div>
    <address>
      {{#if location.address}}
      <span class="address-detail">{{location.address}}</span>
      {{/if}}
      {{#if location.city}}
      <span class="address-detail">{{location.city}},</span>
      {{/if}}
      {{#if location.region}}
      <span class="address-detail">{{location.region}}</span>
      {{/if}}
      {{#if location.postalCode}}
      <span class="address-detail">{{location.postalCode}}</span>
      {{/if}}
      {{#if location.countryCode}}
      <span class="address-detail">{{location.countryCode}}</span>
      {{/if}}
    </address>
    {{/if}}
  </header>

  {{#if profiles.length}}
  <div class="profiles">
    {{#each profiles}}
    <div class="profile">
      {{#if network}}
      <strong class="network">{{network}}</strong>
      {{/if}}
      {{#if username}}
      <span class="username">
        {{#if url}}
        <a href="{{url}}" target="external">@{{username}}</a>
        {{else}}
        {{username}}
        {{/if}}
      </span>
      {{/if}}
    </div>
    <div class="profile print">
      {{#if username}}
      <span class="username">
        {{#if url}}
        {{url}}
        {{/if}}
      </span>
      {{/if}}
    </div>
    {{/each}}
  </div>
  {{/if}}
</section>
{{/resume.basics}}`;
