export default `section.experience .item {
  border-bottom: 1px solid var(--light-grey);
  margin: 0 0 0.5em;
  padding: 0 0 0.5em;
}
section.experience .item:last-child {
  border-bottom: none;
}
section.experience .item header a,
section.experience .item header h3 {
  color: var(--copy-color);
  display: inline-block;
  font-weight: 400;
  text-decoration: none;
}
@media (max-width: 566px) {
  section.experience .item header .subhead {
    flex-direction: column;
    margin-bottom: var(--spacing-double);
  }
}
section.experience .item .summary p {
  margin-top: var(--spacing);
}
section.experience .item .summary p:first-child {
  margin-top: var(--spacing-small);
}
section.experience .item .summary p:last-child {
  margin-bottom: var(--spacing-small);
}
section.experience .item .position {
  color: var(--copy-color-light);
  font-size: 100%;
  font-weight: 500;
  margin: var(--spacing-small) 0;
}
section.experience .item .startDate,
section.experience .item .endDate {
  color: var(--grey);
}
section.skills .item {
  margin: 0;
  padding: 0 0 var(--spacing);
}
section.skills .item:first-child {
  margin-top: var(--spacing);
}
section.skills .item:last-child {
  margin-bottom: var(--spacing);
}
section.skills .item .name {
  display: inline-block;
  font-size: 90%;
  font-weight: 600;
  margin: 0 var(--spacing) 0 0;
  text-transform: uppercase;
  vertical-align: top;
  white-space: nowrap;
}
section.skills .item .keywords {
  display: inline-block;
  font-size: 90%;
  vertical-align: top;
}

section.volunteering .item .position {
  font-weight: 600;
}
section.volunteering .item header .subhead {
  margin-top: var(--spacing);
}
section.projects .item strong {
  color: var(--copy-color-light);
  font-weight: 600;
  display: inline-block;
  padding-top: var(--spacing);
}
section.awards .item .title {
  font-weight: 600;
}
section.publications .item .name {
  font-weight: 600;
}
section.languages .language-item {
  align-items: baseline;
  display: flex;
  justify-content: start;
}
section.languages .language-item:first-child {
  margin-top: var(--spacing);
}
section.languages .language-item:last-child {
  margin-bottom: var(--spacing);
}
section.languages .language-item .language {
  display: inline-block;
  font-size: 90%;
  font-weight: 600;
  margin: 0 var(--spacing) 0 0;
  text-transform: uppercase;
  vertical-align: top;
  white-space: nowrap;
}
section.languages .language-item .fluency {
  color: var(--copy-color-light);
  font-style: italic;
}

section.interests .item {
  margin-bottom: var(--spacing);
}
section.interests .item:last-child {
  margin-bottom: var(--spacing);
}
section.interests .item .name {
  display: inline-block;
  font-size: 90%;
  font-weight: 600;
  margin: 0 var(--spacing) 0 0;
  text-transform: uppercase;
  vertical-align: top;
  white-space: nowrap;
}

section.references .item blockquote {
  font-style: italic;
  margin-bottom: 0;
  margin-left: var(--spacing);
}
section.references .item .name {
  color: var(--copy-color-light);
}

section.experience .item .highlights,
section.volunteering .highlights,
section.projects .highlights,
section.projects .keywords,
section.projects .roles,
section.education .item .courses {
  font-size: 90%;
  line-height: 1.3;
  list-style: square;
  margin: var(--spacing-small) 0 var(--spacing);
  padding-left: var(--spacing-double);
}

section.experience .item,
section.volunteering .item,
section.projects .item,
section.education .item,
section.certificates .item,
section.awards .item,
section.publications .item,
section.interests .item,
section.references .item {
  page-break-inside: avoid;
}

section.experience .item header .subhead,
section.volunteering .item header .subhead,
section.projects .item header,
section.education .item header,
section.certificates .item header,
section.awards .item header,
section.publications .item .subhead {
  align-items: baseline;
  display: flex;
  justify-content: space-between;
}
@media (min-width: 567px) {
  section.experience .item header .subhead,
  section.volunteering .item header .subhead,
  section.projects .item header,
  section.education .item header,
  section.certificates .item header,
  section.awards .item header,
  section.publications .item .subhead {
    flex-direction: row;
  }
}`;
