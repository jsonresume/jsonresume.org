export default `{{#if resume.basics}}
    <section class="section-contact">
        {{>title title='Contact'}}
        <ul class="contact">
            {{#if resume.basics.location}}
                <li class="icon-item clearfix">
                    <i class="fa fa-map-marker"></i>
                    {{resume.basics.location.address}}
                        {{resume.basics.location.postalCode}}
                        {{resume.basics.location.city}}
                        {{resume.basics.location.region}}
                        {{resume.basics.location.countryCode}}
                </li>
            {{/if}}
            {{#if resume.basics.email}}
                <li class="icon-item clearfix">
                    <i class="fa fa-envelope "></i>
                    {{resume.basics.email}}
                </li>
            {{/if}}
            {{#if resume.basics.phone}}
                <li class="icon-item clearfix">
                    <i class="fa fa-phone "></i>
                    {{resume.basics.phone}}
                </li>
            {{/if}}
            {{#if resume.basics.website}}
                <li class="icon-item clearfix">
                    <i class="fa fa-link "></i>
                    {{resume.basics.website}}
                </li>
            {{/if}}
        </ul>
        {{#if resume.basics.profiles.length}}
            <ul class="profiles">
                {{#each resume.basics.profiles}}
                    <li class="icon-item clearfix">
                        <i class="fa fa-{{networkIcon network}} "></i>
                        <span>{{wordWrap url}}</span>
                    </li>
                {{/each}}
            </ul>
        {{/if}}
    </section>
{{/if}}`;
