import styled from 'styled-components';
import {
  Section,
  SectionTitle,
  ListItem,
  DateRange,
  BadgeList,
  safeUrl,
  getLinkRel,
} from '@resume/core';

/**
 * Elegant Pink Resume Theme
 * Super girly theme with soft pinks, elegant typography, and decorative elements
 */

const Layout = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 60px 40px;
  background: linear-gradient(135deg, #fff5f7 0%, #ffe4e8 100%);
  min-height: 100vh;
  font-family: 'Georgia', serif;
  color: #5a4048;

  @media print {
    background: white;
    min-height: auto;
    padding: 40px 30px;
  }
`;

const HeaderCard = styled.div`
  background: white;
  border-radius: 30px;
  padding: 50px 40px;
  margin-bottom: 40px;
  box-shadow: 0 10px 40px rgba(232, 121, 158, 0.15);
  text-align: center;
  border: 3px solid #ffd4e5;
  position: relative;

  &:before {
    content: '✿';
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 30px;
    color: #ff9fc7;
    background: white;
    padding: 0 15px;
  }

  @media print {
    box-shadow: none;
    border: 2px solid #ffd4e5;
  }
`;

const ProfilePhoto = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  overflow: hidden;
  border: 5px solid #ffb3d9;
  margin: 0 auto 25px;
  box-shadow: 0 8px 25px rgba(255, 179, 217, 0.3);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Name = styled.h1`
  font-family: 'Brush Script MT', cursive;
  font-size: 56px;
  font-weight: 400;
  margin: 0 0 10px 0;
  color: #d63384;
  text-shadow: 2px 2px 4px rgba(214, 51, 132, 0.1);
  letter-spacing: 2px;
`;

const JobTitle = styled.div`
  font-size: 20px;
  color: #9d5b7a;
  margin-bottom: 20px;
  font-style: italic;
  font-weight: 300;
`;

const Divider = styled.div`
  width: 60px;
  height: 3px;
  background: linear-gradient(to right, #ff9fc7, #ffb3d9, #ffc9e5);
  margin: 20px auto;
  border-radius: 2px;
`;

const Contact = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 25px;
  font-size: 14px;
  color: #8b6679;

  a {
    color: #d63384;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: #ff9fc7;
    }
  }
`;

const ContactItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:before {
    content: '❀';
    color: #ffb3d9;
    font-size: 16px;
  }
`;

const Summary = styled.p`
  text-align: center;
  line-height: 1.8;
  font-size: 15px;
  color: #6b5260;
  max-width: 600px;
  margin: 25px auto 0;
`;

const ContentCard = styled.div`
  background: white;
  border-radius: 25px;
  padding: 35px 40px;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(232, 121, 158, 0.1);
  border: 2px solid #ffe4f0;

  @media print {
    box-shadow: none;
    border: 1px solid #ffe4f0;
    page-break-inside: avoid;
  }
`;

const StyledSectionTitle = styled.h2`
  font-family: 'Georgia', serif;
  font-size: 28px;
  font-weight: 600;
  color: #d63384;
  margin: 0 0 25px 0;
  padding-bottom: 15px;
  border-bottom: 2px solid #ffd4e5;
  display: flex;
  align-items: center;
  gap: 12px;

  &:before {
    content: '✿';
    font-size: 24px;
    color: #ff9fc7;
  }
`;

const WorkItem = styled.div`
  margin-bottom: 30px;
  padding-left: 20px;
  border-left: 3px solid #ffd4e5;

  &:last-child {
    margin-bottom: 0;
  }
`;

const WorkHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 10px;
`;

const WorkTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #9d5b7a;
`;

const WorkCompany = styled.div`
  font-size: 16px;
  color: #b87a99;
  margin-top: 5px;
  font-style: italic;
`;

const WorkDate = styled.div`
  font-size: 14px;
  color: #c78aaa;
  white-space: nowrap;
  font-weight: 500;
`;

const WorkDescription = styled.p`
  color: #6b5260;
  line-height: 1.7;
  margin: 10px 0;
  font-size: 14px;
`;

const HighlightsList = styled.ul`
  margin: 10px 0 0 0;
  padding-left: 20px;
  color: #6b5260;
  font-size: 14px;

  li {
    margin: 6px 0;
    line-height: 1.6;
    position: relative;

    &:before {
      content: '❀';
      position: absolute;
      left: -20px;
      color: #ffb3d9;
      font-size: 12px;
    }
  }
`;

const EducationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`;

const EducationCard = styled.div`
  background: linear-gradient(135deg, #fff9fb 0%, #fff5f8 100%);
  border-radius: 15px;
  padding: 20px;
  border: 2px solid #ffe4f0;

  h3 {
    font-size: 18px;
    color: #9d5b7a;
    margin: 0 0 8px 0;
  }

  .institution {
    font-size: 15px;
    color: #b87a99;
    margin-bottom: 8px;
  }

  .dates {
    font-size: 13px;
    color: #c78aaa;
    font-style: italic;
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const SkillCategory = styled.div`
  h3 {
    font-size: 16px;
    color: #9d5b7a;
    margin: 0 0 12px 0;
    font-weight: 600;
  }
`;

const SkillBadge = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, #ffe4f0 0%, #ffeef5 100%);
  color: #9d5b7a;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  margin: 4px;
  border: 1px solid #ffd4e5;
  font-weight: 500;
`;

const ReferenceCard = styled.div`
  background: linear-gradient(135deg, #fff9fb 0%, #fff5f8 100%);
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 20px;
  border-left: 4px solid #ff9fc7;

  h3 {
    font-size: 18px;
    color: #9d5b7a;
    margin: 0 0 8px 0;
  }

  .quote {
    color: #6b5260;
    line-height: 1.7;
    font-size: 14px;
    font-style: italic;
    position: relative;
    padding-left: 20px;

    &:before {
      content: '"';
      position: absolute;
      left: 0;
      top: -5px;
      font-size: 40px;
      color: #ffd4e5;
      font-family: Georgia, serif;
    }
  }
`;

function Resume({ resume }) {
  const {
    basics = {},
    work = [],
    education = [],
    skills = [],
    projects = [],
    awards = [],
    references = [],
    languages = [],
  } = resume;

  return (
    <Layout>
      {/* Header Section */}
      <HeaderCard>
        {basics.image && (
          <ProfilePhoto>
            <img src={basics.image} alt={basics.name} />
          </ProfilePhoto>
        )}

        <Name>{basics.name}</Name>
        {basics.label && <JobTitle>{basics.label}</JobTitle>}

        <Divider />

        <Contact>
          {basics.email && (
            <ContactItem>
              <a href={safeUrl(`mailto:${basics.email}`)}>{basics.email}</a>
            </ContactItem>
          )}
          {basics.phone && <ContactItem>{basics.phone}</ContactItem>}
          {basics.location && (
            <ContactItem>
              {[basics.location.city, basics.location.region]
                .filter(Boolean)
                .join(', ')}
            </ContactItem>
          )}
          {basics.url && (
            <ContactItem>
              <a
                href={safeUrl(basics.url)}
                target="_blank"
                rel={getLinkRel(basics.url, true)}
              >
                {basics.url.replace(/^https?:\/\//, '')}
              </a>
            </ContactItem>
          )}
        </Contact>

        {basics.summary && <Summary>{basics.summary}</Summary>}
      </HeaderCard>

      {/* Work Experience */}
      {work.length > 0 && (
        <ContentCard>
          <StyledSectionTitle>Work Experience</StyledSectionTitle>
          {work.map((job, index) => (
            <WorkItem key={index}>
              <WorkHeader>
                <div>
                  <WorkTitle>{job.position}</WorkTitle>
                  <WorkCompany>{job.name}</WorkCompany>
                </div>
                <WorkDate>
                  {job.startDate && (
                    <>
                      {new Date(job.startDate).getFullYear()} -{' '}
                      {job.endDate
                        ? new Date(job.endDate).getFullYear()
                        : 'Present'}
                    </>
                  )}
                </WorkDate>
              </WorkHeader>
              {job.summary && <WorkDescription>{job.summary}</WorkDescription>}
              {job.highlights && job.highlights.length > 0 && (
                <HighlightsList>
                  {job.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </HighlightsList>
              )}
            </WorkItem>
          ))}
        </ContentCard>
      )}

      {/* Education */}
      {education.length > 0 && (
        <ContentCard>
          <StyledSectionTitle>Education</StyledSectionTitle>
          <EducationGrid>
            {education.map((edu, index) => (
              <EducationCard key={index}>
                <h3>
                  {edu.studyType && edu.area
                    ? `${edu.studyType} in ${edu.area}`
                    : edu.area || edu.studyType}
                </h3>
                <div className="institution">{edu.institution}</div>
                {(edu.startDate || edu.endDate) && (
                  <div className="dates">
                    {edu.startDate &&
                      `${new Date(edu.startDate).getFullYear()}`}
                    {edu.startDate && edu.endDate && ' - '}
                    {edu.endDate && `${new Date(edu.endDate).getFullYear()}`}
                  </div>
                )}
                {edu.score && (
                  <div
                    style={{
                      marginTop: '8px',
                      fontSize: '13px',
                      color: '#9d5b7a',
                    }}
                  >
                    GPA: {edu.score}
                  </div>
                )}
              </EducationCard>
            ))}
          </EducationGrid>
        </ContentCard>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <ContentCard>
          <StyledSectionTitle>Skills</StyledSectionTitle>
          <SkillsGrid>
            {skills.map((skillGroup, index) => (
              <SkillCategory key={index}>
                {skillGroup.name && <h3>{skillGroup.name}</h3>}
                <div>
                  {skillGroup.keywords?.map((skill, idx) => (
                    <SkillBadge key={idx}>{skill}</SkillBadge>
                  ))}
                </div>
              </SkillCategory>
            ))}
          </SkillsGrid>
        </ContentCard>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <ContentCard>
          <StyledSectionTitle>Projects</StyledSectionTitle>
          {projects.map((project, index) => (
            <WorkItem key={index}>
              <WorkHeader>
                <div>
                  <WorkTitle>{project.name}</WorkTitle>
                  {project.url && (
                    <WorkCompany>
                      <a
                        href={safeUrl(project.url)}
                        target="_blank"
                        rel={getLinkRel(project.url, true)}
                        style={{ color: '#d63384' }}
                      >
                        {project.url}
                      </a>
                    </WorkCompany>
                  )}
                </div>
              </WorkHeader>
              {project.description && (
                <WorkDescription>{project.description}</WorkDescription>
              )}
              {project.highlights && project.highlights.length > 0 && (
                <HighlightsList>
                  {project.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </HighlightsList>
              )}
            </WorkItem>
          ))}
        </ContentCard>
      )}

      {/* Awards */}
      {awards.length > 0 && (
        <ContentCard>
          <StyledSectionTitle>Awards & Honors</StyledSectionTitle>
          {awards.map((award, index) => (
            <WorkItem key={index}>
              <WorkTitle>{award.title}</WorkTitle>
              <WorkCompany>
                {award.awarder}
                {award.date &&
                  ` • ${new Date(award.date).toLocaleDateString()}`}
              </WorkCompany>
              {award.summary && (
                <WorkDescription>{award.summary}</WorkDescription>
              )}
            </WorkItem>
          ))}
        </ContentCard>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <ContentCard>
          <StyledSectionTitle>Languages</StyledSectionTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {languages.map((lang, index) => (
              <SkillBadge key={index}>
                {lang.language}
                {lang.fluency && ` - ${lang.fluency}`}
              </SkillBadge>
            ))}
          </div>
        </ContentCard>
      )}

      {/* References */}
      {references.length > 0 && (
        <ContentCard>
          <StyledSectionTitle>References</StyledSectionTitle>
          {references.map((ref, index) => (
            <ReferenceCard key={index}>
              <h3>{ref.name}</h3>
              <div className="quote">{ref.reference}</div>
            </ReferenceCard>
          ))}
        </ContentCard>
      )}
    </Layout>
  );
}

export default Resume;
