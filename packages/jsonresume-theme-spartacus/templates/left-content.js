export default `    <div class='left-content'>
      {{#resume.basics}}
      <section class='card'>
        <div class='section-header'>Contact</div>
        <div class='section-content' id='contact'>
          <div class='contact'>
            {{#location}}
            <div class='address'>
              {{#if city}}{{city}}{{/if}}{{#if region}}, {{region}}{{/if}}{{#if countryCode}}, {{countryCode}}{{/if}}
            </div>
            {{/location}}
            <div class='email'>
              <a href='mailto:{{email}}'>{{email}}</a>
            </div>
            {{#if profiles.length}} {{#each profiles}} {{#if url}}
            <div class='site'>
              {{network}}: <a href='{{url}}'>{{username}}</a>
            </div>
            {{/if}} {{/each}} {{/if}}
            <div class='phone-number last'>
              <a href="tel:{{phone}}">{{phone}}</a>
            </div>
          </div>
        </div>
      </section>
      {{/resume.basics}} {{#if resume.skills.length}}
      <section class='card'>
        <div class='section-header'>Technical Skills</div>
        <div class='section-content' id='technical-skills'>
          <div id='skills-container'>
            {{#each resume.skills}}
            <div class='skills'>
              {{#if name}}
              <div class='skill'>{{name}}</div>
              {{/if}} {{#if level}}
              <div class="level">
                <em>{{level}}</em>
              </div>
              {{/if}} {{#if keywords.length}}
              <p>
                {{#each keywords}} {{.}}{{#unless @last}},{{/unless}} {{/each}}
              </p>
              {{/if}}
            </div>
            {{/each}}
          </div>
        </div>
      </section>
      {{/if}} {{#if resume.education.length}}
      <section class='card'>
        <div class='section-header'>Education</div>
        <div class='section-content' id='education'>
          {{#each resume.education}}
          <div class='education last'>
            <div class='education-info'>
              <div class='title'>
                {{#if studyType}}{{studyType}}{{/if}} in {{#if area}}{{area}}{{/if}}
                <br>at {{#if institution}} {{institution}} {{/if}}
              </div>
              <div class='duration'>
                {{#if startDate}} {{prettifyDate startDate}} {{/if}} {{#if endDate}} - {{prettifyDate endDate}} {{else}} - Present {{/if}}
              </div>
            </div>
            {{#if gpa}}
            <div class='grade'>Grade: {{gpa}}</div>{{/if}}
          </div>
          {{/each}}
        </div>
      </section>
      {{/if}} {{#if resume.awards.length}}
      <section class='card'>
        <div class='section-header'>Awards</div>
        <div class='section-content' id='awards'>
          {{#each resume.awards}}
          <div class='awards last'>
            <div class='awards-info'>
              <div class='title'>
                {{#if title}}{{title}}{{/if}} {{#if awarder}}<br/>{{awarder}}{{/if}}
              </div>
              {{#if summary}}
              <div class='summary'>
                {{summary}}
              </div>
              {{/if}}
              <div class='duration'>
                {{#if date}} {{prettifyDate date}} {{/if}}
              </div>
            </div>
          </div>
          {{/each}}
        </div>
      </section>
      {{/if}}
    </div>`;
