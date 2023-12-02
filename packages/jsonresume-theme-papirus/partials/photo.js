export default `{{#if resume.basics}}
    <section class="section-basic">
        {{#if resume.basics.picture}}
            <div class="avatar">
                <img src="{{ resume.basics.picture }}" alt="{{resume.basics.name}}" class="img-circle">
            </div>
        {{/if}}
    </section>
{{/if}}`;
