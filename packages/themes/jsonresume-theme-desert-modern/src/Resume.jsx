import React from 'react';
import { DateRange } from '@resume/core';
import {
  Layout,
  Header,
  Name,
  Label,
  StyledContactInfo,
  Summary,
  SectionBlock,
  SectionHeading,
  Entry,
  EntryHeader,
  EntryTitle,
  EntrySubtitle,
  EntryMeta,
  EntrySummary,
  BulletList,
  SkillGrid,
  SkillCard,
  SkillTitle,
  KeywordList,
  Pill,
  Anchor,
} from './styles';

const joinParts = (...parts) => parts.filter(Boolean).join(' • ');

const renderHighlights = (items) =>
  items?.length ? (
    <BulletList>
      {items.map((text, index) => (
        <li key={index}>{text}</li>
      ))}
    </BulletList>
  ) : null;

function Resume({ resume }) {
  const {
    basics = {},
    work = [],
    education = [],
    projects = [],
    volunteer = [],
    skills = [],
    awards = [],
    certificates = [],
    publications = [],
    languages = [],
    interests = [],
    references = [],
  } = resume;

  return (
    <Layout>
      <Header>
        {basics.name && <Name>{basics.name}</Name>}
        {basics.label && <Label>{basics.label}</Label>}
        <StyledContactInfo basics={basics} />
        {basics.summary && <Summary>{basics.summary}</Summary>}
      </Header>

      {work?.length > 0 && (
        <SectionBlock>
          <SectionHeading>Experience</SectionHeading>
          {work.map((job, index) => (
            <Entry key={index}>
              <EntryHeader>
                <div>
                  {job.position && <EntryTitle>{job.position}</EntryTitle>}
                  {job.name || job.location ? (
                    <EntrySubtitle>
                      {joinParts(job.name, job.location)}
                    </EntrySubtitle>
                  ) : null}
                </div>
                {(job.startDate || job.endDate) && (
                  <EntryMeta>
                    <DateRange
                      startDate={job.startDate}
                      endDate={job.endDate}
                    />
                  </EntryMeta>
                )}
              </EntryHeader>
              {job.summary && <EntrySummary>{job.summary}</EntrySummary>}
              {renderHighlights(job.highlights)}
            </Entry>
          ))}
        </SectionBlock>
      )}

      {projects?.length > 0 && (
        <SectionBlock>
          <SectionHeading>Projects</SectionHeading>
          {projects.map((project, index) => {
            const summary = project.description || project.summary;
            const descriptor = joinParts(project.entity, project.type);
            return (
              <Entry key={index}>
                <EntryHeader>
                  <div>
                    {project.name && <EntryTitle>{project.name}</EntryTitle>}
                    {(descriptor || project.url) && (
                      <EntrySubtitle>
                        {descriptor}
                        {descriptor && project.url ? ' • ' : ''}
                        {project.url && (
                          <Anchor href={project.url}>{project.url}</Anchor>
                        )}
                      </EntrySubtitle>
                    )}
                  </div>
                  {(project.startDate || project.endDate) && (
                    <EntryMeta>
                      <DateRange
                        startDate={project.startDate}
                        endDate={project.endDate}
                      />
                    </EntryMeta>
                  )}
                </EntryHeader>
                {summary && <EntrySummary>{summary}</EntrySummary>}
                {renderHighlights(project.highlights)}
                {project.keywords?.length > 0 && (
                  <KeywordList>{project.keywords.join(' • ')}</KeywordList>
                )}
              </Entry>
            );
          })}
        </SectionBlock>
      )}

      {education?.length > 0 && (
        <SectionBlock>
          <SectionHeading>Education</SectionHeading>
          {education.map((edu, index) => (
            <Entry key={index}>
              <EntryHeader>
                <div>
                  {edu.institution && (
                    <EntryTitle>{edu.institution}</EntryTitle>
                  )}
                  {(edu.studyType || edu.area || edu.score) && (
                    <EntrySubtitle>
                      {joinParts(
                        [edu.studyType, edu.area].filter(Boolean).join(' in '),
                        edu.score
                      )}
                    </EntrySubtitle>
                  )}
                </div>
                {(edu.startDate || edu.endDate) && (
                  <EntryMeta>
                    <DateRange
                      startDate={edu.startDate}
                      endDate={edu.endDate}
                    />
                  </EntryMeta>
                )}
              </EntryHeader>
              {edu.courses?.length > 0 && (
                <KeywordList>Key courses: {edu.courses.join(', ')}</KeywordList>
              )}
            </Entry>
          ))}
        </SectionBlock>
      )}

      {skills?.length > 0 && (
        <SectionBlock>
          <SectionHeading>Skills</SectionHeading>
          <SkillGrid>
            {skills.map((skill, index) => (
              <SkillCard key={index}>
                <SkillTitle>
                  {skill.name}
                  {skill.level && <Pill>{skill.level}</Pill>}
                </SkillTitle>
                {skill.keywords?.length > 0 && (
                  <KeywordList>{skill.keywords.join(' • ')}</KeywordList>
                )}
              </SkillCard>
            ))}
          </SkillGrid>
        </SectionBlock>
      )}

      {volunteer?.length > 0 && (
        <SectionBlock>
          <SectionHeading>Volunteer</SectionHeading>
          {volunteer.map((item, index) => (
            <Entry key={index}>
              <EntryHeader>
                <div>
                  {item.position && <EntryTitle>{item.position}</EntryTitle>}
                  {(item.organization || item.location) && (
                    <EntrySubtitle>
                      {joinParts(item.organization, item.location)}
                    </EntrySubtitle>
                  )}
                </div>
                {(item.startDate || item.endDate) && (
                  <EntryMeta>
                    <DateRange
                      startDate={item.startDate}
                      endDate={item.endDate}
                    />
                  </EntryMeta>
                )}
              </EntryHeader>
              {item.summary && <EntrySummary>{item.summary}</EntrySummary>}
              {renderHighlights(item.highlights)}
            </Entry>
          ))}
        </SectionBlock>
      )}

      {awards?.length > 0 && (
        <SectionBlock>
          <SectionHeading>Awards</SectionHeading>
          {awards.map((award, index) => (
            <Entry key={index}>
              <EntryHeader>
                <div>
                  {award.title && <EntryTitle>{award.title}</EntryTitle>}
                  {award.awarder && (
                    <EntrySubtitle>Issued by {award.awarder}</EntrySubtitle>
                  )}
                </div>
                {award.date && <EntryMeta>{award.date}</EntryMeta>}
              </EntryHeader>
              {award.summary && <EntrySummary>{award.summary}</EntrySummary>}
            </Entry>
          ))}
        </SectionBlock>
      )}

      {certificates?.length > 0 && (
        <SectionBlock>
          <SectionHeading>Certifications</SectionHeading>
          {certificates.map((cert, index) => (
            <Entry key={index}>
              <EntryHeader>
                <div>
                  {cert.name && <EntryTitle>{cert.name}</EntryTitle>}
                  {cert.issuer && (
                    <EntrySubtitle>Issued by {cert.issuer}</EntrySubtitle>
                  )}
                </div>
                {cert.date && <EntryMeta>{cert.date}</EntryMeta>}
              </EntryHeader>
              {cert.summary && <EntrySummary>{cert.summary}</EntrySummary>}
              {cert.url && (
                <KeywordList>
                  <Anchor href={cert.url}>{cert.url}</Anchor>
                </KeywordList>
              )}
            </Entry>
          ))}
        </SectionBlock>
      )}

      {publications?.length > 0 && (
        <SectionBlock>
          <SectionHeading>Publications</SectionHeading>
          {publications.map((pub, index) => (
            <Entry key={index}>
              <EntryHeader>
                <div>
                  {pub.name && <EntryTitle>{pub.name}</EntryTitle>}
                  {(pub.publisher || pub.url) && (
                    <EntrySubtitle>
                      {pub.publisher}
                      {pub.publisher && pub.url ? ' • ' : ''}
                      {pub.url && <Anchor href={pub.url}>{pub.url}</Anchor>}
                    </EntrySubtitle>
                  )}
                </div>
                {pub.releaseDate && <EntryMeta>{pub.releaseDate}</EntryMeta>}
              </EntryHeader>
              {pub.summary && <EntrySummary>{pub.summary}</EntrySummary>}
            </Entry>
          ))}
        </SectionBlock>
      )}

      {languages?.length > 0 && (
        <SectionBlock>
          <SectionHeading>Languages</SectionHeading>
          <SkillGrid>
            {languages.map((lang, index) => (
              <SkillCard key={index}>
                <SkillTitle>{lang.language}</SkillTitle>
                {lang.fluency && <Pill>{lang.fluency}</Pill>}
              </SkillCard>
            ))}
          </SkillGrid>
        </SectionBlock>
      )}

      {interests?.length > 0 && (
        <SectionBlock>
          <SectionHeading>Interests</SectionHeading>
          <SkillGrid>
            {interests.map((interest, index) => (
              <SkillCard key={index}>
                <SkillTitle>{interest.name}</SkillTitle>
                {interest.keywords?.length > 0 && (
                  <KeywordList>{interest.keywords.join(' • ')}</KeywordList>
                )}
              </SkillCard>
            ))}
          </SkillGrid>
        </SectionBlock>
      )}

      {references?.length > 0 && (
        <SectionBlock>
          <SectionHeading>References</SectionHeading>
          {references.map((ref, index) => (
            <Entry key={index}>
              {ref.name && <EntryTitle>{ref.name}</EntryTitle>}
              {ref.reference && <EntrySummary>{ref.reference}</EntrySummary>}
            </Entry>
          ))}
        </SectionBlock>
      )}
    </Layout>
  );
}

export default Resume;
