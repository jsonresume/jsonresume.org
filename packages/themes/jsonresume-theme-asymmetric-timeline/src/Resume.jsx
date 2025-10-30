import React from 'react';
import { Header } from './components/Header.jsx';
import { TimelineItem } from './components/TimelineItem.jsx';
import { SimpleItem } from './components/SimpleSection.jsx';
import { SkillsGrid } from './components/SkillsGrid.jsx';
import {
  Layout,
  TimelineSection,
  StyledSectionTitle,
  GridSection,
  SimpleSection,
} from './styles.jsx';

function Resume({ resume }) {
  const {
    basics = {},
    work = [],
    education = [],
    skills = [],
    projects = [],
    volunteer = [],
    awards = [],
    publications = [],
    languages = [],
    interests = [],
    references = [],
  } = resume;

  return (
    <Layout>
      <Header basics={basics} />

      {work?.length > 0 && (
        <TimelineSection>
          <StyledSectionTitle>Experience</StyledSectionTitle>
          {work.map((job, index) => (
            <TimelineItem
              key={index}
              item={job}
              isLeft={index % 2 === 0}
              type="work"
            />
          ))}
        </TimelineSection>
      )}

      {education?.length > 0 && (
        <TimelineSection>
          <StyledSectionTitle>Education</StyledSectionTitle>
          {education.map((edu, index) => (
            <TimelineItem
              key={index}
              item={edu}
              isLeft={index % 2 === 0}
              type="education"
            />
          ))}
        </TimelineSection>
      )}

      {projects?.length > 0 && (
        <SimpleSection>
          <StyledSectionTitle>Projects</StyledSectionTitle>
          {projects.map((project, index) => (
            <SimpleItem key={index} item={project} type="project" />
          ))}
        </SimpleSection>
      )}

      {skills?.length > 0 && (
        <GridSection>
          <StyledSectionTitle>Skills</StyledSectionTitle>
          <SkillsGrid items={skills} type="skills" />
        </GridSection>
      )}

      {volunteer?.length > 0 && (
        <SimpleSection>
          <StyledSectionTitle>Volunteer</StyledSectionTitle>
          {volunteer.map((vol, index) => (
            <SimpleItem key={index} item={vol} type="volunteer" />
          ))}
        </SimpleSection>
      )}

      {awards?.length > 0 && (
        <SimpleSection>
          <StyledSectionTitle>Awards</StyledSectionTitle>
          {awards.map((award, index) => (
            <SimpleItem key={index} item={award} type="award" />
          ))}
        </SimpleSection>
      )}

      {publications?.length > 0 && (
        <SimpleSection>
          <StyledSectionTitle>Publications</StyledSectionTitle>
          {publications.map((pub, index) => (
            <SimpleItem key={index} item={pub} type="publication" />
          ))}
        </SimpleSection>
      )}

      {languages?.length > 0 && (
        <GridSection>
          <StyledSectionTitle>Languages</StyledSectionTitle>
          <SkillsGrid items={languages} type="languages" />
        </GridSection>
      )}

      {interests?.length > 0 && (
        <GridSection>
          <StyledSectionTitle>Interests</StyledSectionTitle>
          <SkillsGrid items={interests} type="interests" />
        </GridSection>
      )}

      {references?.length > 0 && (
        <SimpleSection>
          <StyledSectionTitle>References</StyledSectionTitle>
          {references.map((ref, index) => (
            <SimpleItem key={index} item={ref} type="reference" />
          ))}
        </SimpleSection>
      )}
    </Layout>
  );
}

export default Resume;
