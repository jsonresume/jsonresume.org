export default `    <div class='right-content'>
      {{#if resume.basics.summary}}
      <section class='card'>
        <div class='section-header'>Summary</div>
        <div class='section-content' id='summary'>
          {{{resume.basics.summary}}}
        </div>
      </section>
      {{/if}}
      {{#if resume.work.length}}
      <section class='card'>
        <div class='section-header'>Employment</div>
        <div class='section-content' id='employment'>
          {{#each resume.work}}
          <div class='employment'>
            <div class='employment-info'>
              <div class='title'>
                {{#if company}}
                <a href='{{#if website}}{{website}}{{/if}}'>
                  		{{company}}
                  	</a> {{/if}} {{#if position}} {{position}} {{/if}}
              </div>
              <div class='duration'>
                {{#if startDate}} {{prettifyDate startDate}} {{/if}} {{#if endDate}} - {{prettifyDate endDate}} {{else}} - Present {{/if}}
              </div>
            </div>
            <div class='info'>
              {{#if summary}}
              <div class="summary">
                {{summary}}
              </div>
              {{/if}} {{#if highlights.length}}
              <ul class="list">
                {{#each highlights}}
                <li>{{.}}</li>
                {{/each}}
              </ul>
              {{/if}}
            </div>
          </div>
          {{/each}}
        </div>
      </section>
      {{/if}} {{#if resume.volunteer.length}}
      <section class='card'>
        <div class='section-header'>Projects</div>
        <div class='section-content' id='projects'>
          {{#each resume.volunteer}}
          <div class='project last'>
            <div class='project-info'>
              <div class='title'>{{#if summary}}{{summary}}{{/if}}</div>
              {{#if website}}<a class='content' href='{{website}}'>{{website}}</a>{{/if}}
            </div>
            <div class='info'>
              {{#if highlights.length}}
              <ul class="list">
                {{#each highlights}}
                <li>{{.}}</li>
                {{/each}}
              </ul>
              {{/if}}
            </div>
          </div>
          {{/each}}
        </div>
      </section>
      {{/if}} {{#if resume.references.length}}
      <section class='card' style="margin-bottom: 48px;">
        <div class='section-header'>References</div>
        <div class='section-content' id='interests'>
          {{#each resume.references}} {{#if reference}}
          <blockquote class="reference">
            {{reference}}
          </blockquote>
          {{/if}} {{#if name}}
          <div class="name">
            — {{name}}
          </div>
          {{/if}} {{/each}}
        </div>
      </section>
      {{/if}}
    </div>
  </div>
</body>

</html>`;
