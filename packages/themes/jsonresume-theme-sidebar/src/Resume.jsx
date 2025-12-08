import styled from 'styled-components';
import {
  Section,
  SectionTitle,
  ListItem,
  DateRange,
  BadgeList,
  safeUrl,
  getLinkRel,
} from '@jsonresume/core';

/**
 * Sidebar Resume Theme
 * Two-column layout with dark sidebar and light main content
 */

const Layout = styled.div`
  display: grid;
  grid-template-columns: 315px 1fr;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 11pt;
  line-height: 1.6;
  color: #333;

  @media print {
    min-height: auto;
  }
`;

const Sidebar = styled.aside`
  background: #1e3a52;
  color: #ffffff;
  padding: 40px 30px;
`;

const MainContent = styled.main`
  background: #f5f2ed;
  padding: 60px 50px;
`;

const ProfilePhoto = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  overflow: hidden;
  border: 8px solid #ffffff;
  margin: 0 auto 40px;
  background: #ffffff;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Name = styled.h1`
  font-size: 42pt;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: #2c2c2c;
  letter-spacing: 0.5px;

  span {
    font-weight: 400;
  }
`;

const JobTitle = styled.div`
  font-size: 18pt;
  color: #666;
  margin-bottom: 40px;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding-bottom: 15px;
  border-bottom: 3px solid #1e3a52;
  display: inline-block;
`;

const SidebarSection = styled(Section)`
  margin-bottom: 40px;
`;

const SidebarTitle = styled.h2`
  font-size: 14pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
  font-size: 10pt;

  svg {
    margin-right: 12px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  a {
    color: #ffffff;
    text-decoration: none;
    word-break: break-word;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Icon = styled.span`
  display: inline-block;
  width: 16px;
  margin-right: 12px;
  flex-shrink: 0;
`;

const EducationItem = styled.div`
  margin-bottom: 25px;

  h3 {
    font-size: 11pt;
    font-weight: 600;
    margin: 0 0 5px 0;
  }

  .dates {
    font-size: 10pt;
    margin-bottom: 8px;
    opacity: 0.9;
  }

  ul {
    margin: 5px 0 0 0;
    padding-left: 18px;
    font-size: 10pt;

    li {
      margin: 3px 0;
    }
  }
`;

const SkillsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin: 8px 0;
    padding-left: 15px;
    position: relative;
    font-size: 10pt;

    &:before {
      content: '▪';
      position: absolute;
      left: 0;
      color: rgba(255, 255, 255, 0.7);
    }
  }
`;

const MainSection = styled(Section)`
  margin-bottom: 40px;
`;

const MainSectionTitle = styled.h2`
  font-size: 16pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0 0 25px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #1e3a52;
  color: #1e3a52;
`;

const ProfileText = styled.p`
  text-align: justify;
  line-height: 1.8;
  color: #4a4a4a;
`;

const WorkItem = styled.div`
  margin-bottom: 30px;
  position: relative;
  padding-left: 25px;

  &:before {
    content: '';
    position: absolute;
    left: 4px;
    top: 8px;
    width: 10px;
    height: 10px;
    background: #1e3a52;
    border-radius: 50%;
  }

  &:after {
    content: '';
    position: absolute;
    left: 8px;
    top: 20px;
    width: 2px;
    height: calc(100% - 10px);
    background: #d0d0d0;
  }

  &:last-child:after {
    display: none;
  }
`;

const WorkHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const WorkTitle = styled.h3`
  font-size: 12pt;
  font-weight: 700;
  margin: 0;
  color: #2c2c2c;
`;

const WorkCompany = styled.div`
  font-size: 11pt;
  color: #666;
  margin-bottom: 10px;
`;

const WorkDate = styled.div`
  font-size: 10pt;
  color: #666;
  white-space: nowrap;
  text-align: right;
`;

const WorkDescription = styled.ul`
  margin: 10px 0 0 0;
  padding-left: 20px;
  color: #4a4a4a;

  li {
    margin: 6px 0;
    text-align: justify;
  }
`;

const ReferenceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
`;

const ReferenceCard = styled.div`
  h3 {
    font-size: 12pt;
    font-weight: 700;
    margin: 0 0 5px 0;
    color: #2c2c2c;
  }

  .title {
    font-size: 10pt;
    color: #666;
    margin-bottom: 8px;
  }

  .contact {
    font-size: 9pt;
    color: #666;
    margin: 3px 0;
  }
`;

const LanguagesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin: 8px 0;
    padding-left: 15px;
    position: relative;
    font-size: 10pt;

    &:before {
      content: '▪';
      position: absolute;
      left: 0;
      color: rgba(255, 255, 255, 0.7);
    }
  }
`;

function Resume({ resume }) {
  const {
    basics = {},
    work = [],
    education = [],
    skills = [],
    languages = [],
    references = [],
    projects = [],
    awards = [],
    interests = [],
  } = resume;

  // Split name into first and last for styling
  const nameParts = basics.name ? basics.name.split(' ') : [];
  const firstName = nameParts.slice(0, -1).join(' ');
  const lastName = nameParts[nameParts.length - 1];

  return (
    <Layout>
      {/* Left Sidebar */}
      <Sidebar>
        {/* Profile Photo */}
        {basics.image && (
          <ProfilePhoto>
            <img src={basics.image} alt={basics.name} />
          </ProfilePhoto>
        )}

        {/* Contact Section */}
        {(basics.phone || basics.email || basics.location || basics.url) && (
          <SidebarSection>
            <SidebarTitle>CONTACT</SidebarTitle>
            {basics.phone && (
              <ContactItem>
                <Icon>📞</Icon>
                <span>{basics.phone}</span>
              </ContactItem>
            )}
            {basics.email && (
              <ContactItem>
                <Icon>✉️</Icon>
                <a href={safeUrl(`mailto:${basics.email}`)}>{basics.email}</a>
              </ContactItem>
            )}
            {basics.location && (
              <ContactItem>
                <Icon>📍</Icon>
                <span>
                  {[
                    basics.location.address,
                    basics.location.city,
                    basics.location.region,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              </ContactItem>
            )}
            {basics.url && (
              <ContactItem>
                <Icon>🌐</Icon>
                <a
                  href={safeUrl(basics.url)}
                  target="_blank"
                  rel={getLinkRel(basics.url, true)}
                >
                  {basics.url.replace(/^https?:\/\//, '')}
                </a>
              </ContactItem>
            )}
          </SidebarSection>
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <SidebarSection>
            <SidebarTitle>EDUCATION</SidebarTitle>
            {education.map((edu, index) => (
              <EducationItem key={index}>
                <div className="dates">
                  {edu.startDate && edu.endDate
                    ? `${new Date(edu.startDate).getFullYear()} - ${new Date(
                        edu.endDate
                      ).getFullYear()}`
                    : ''}
                </div>
                <h3>{edu.institution}</h3>
                {edu.studyType && edu.area && (
                  <ul>
                    <li>
                      {edu.studyType} of {edu.area}
                    </li>
                    {edu.score && <li>GPA: {edu.score}</li>}
                  </ul>
                )}
              </EducationItem>
            ))}
          </SidebarSection>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <SidebarSection>
            <SidebarTitle>SKILLS</SidebarTitle>
            <SkillsList>
              {skills.flatMap((skillGroup) =>
                (skillGroup.keywords || []).map((skill, idx) => (
                  <li key={`${skillGroup.name}-${idx}`}>{skill}</li>
                ))
              )}
            </SkillsList>
          </SidebarSection>
        )}

        {/* Languages Section */}
        {languages.length > 0 && (
          <SidebarSection>
            <SidebarTitle>LANGUAGES</SidebarTitle>
            <LanguagesList>
              {languages.map((lang, index) => (
                <li key={index}>
                  {lang.language}
                  {lang.fluency && ` (${lang.fluency})`}
                </li>
              ))}
            </LanguagesList>
          </SidebarSection>
        )}
      </Sidebar>

      {/* Right Main Content */}
      <MainContent>
        {/* Header */}
        <div>
          <Name>
            {firstName && <span>{firstName} </span>}
            {lastName}
          </Name>
          {basics.label && <JobTitle>{basics.label}</JobTitle>}
        </div>

        {/* Profile/Summary Section */}
        {basics.summary && (
          <MainSection>
            <MainSectionTitle>PROFILE</MainSectionTitle>
            <ProfileText>{basics.summary}</ProfileText>
          </MainSection>
        )}

        {/* Work Experience Section */}
        {work.length > 0 && (
          <MainSection>
            <MainSectionTitle>WORK EXPERIENCE</MainSectionTitle>
            {work.map((job, index) => (
              <WorkItem key={index}>
                <WorkHeader>
                  <div>
                    <WorkTitle>{job.name}</WorkTitle>
                    <WorkCompany>{job.position}</WorkCompany>
                  </div>
                  <WorkDate>
                    {job.startDate && (
                      <>
                        {new Date(job.startDate).getFullYear()} -{' '}
                        {job.endDate
                          ? new Date(job.endDate).getFullYear()
                          : 'PRESENT'}
                      </>
                    )}
                  </WorkDate>
                </WorkHeader>
                {job.summary && (
                  <p style={{ marginBottom: '10px', color: '#4a4a4a' }}>
                    {job.summary}
                  </p>
                )}
                {job.highlights && job.highlights.length > 0 && (
                  <WorkDescription>
                    {job.highlights.map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </WorkDescription>
                )}
              </WorkItem>
            ))}
          </MainSection>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <MainSection>
            <MainSectionTitle>PROJECTS</MainSectionTitle>
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
                          style={{ color: '#1e3a52' }}
                        >
                          {project.url}
                        </a>
                      </WorkCompany>
                    )}
                  </div>
                  <WorkDate>
                    {project.startDate && (
                      <>
                        {new Date(project.startDate).getFullYear()}
                        {project.endDate &&
                          ` - ${new Date(project.endDate).getFullYear()}`}
                      </>
                    )}
                  </WorkDate>
                </WorkHeader>
                {project.description && (
                  <p style={{ marginBottom: '10px', color: '#4a4a4a' }}>
                    {project.description}
                  </p>
                )}
                {project.highlights && project.highlights.length > 0 && (
                  <WorkDescription>
                    {project.highlights.map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </WorkDescription>
                )}
              </WorkItem>
            ))}
          </MainSection>
        )}

        {/* Awards Section */}
        {awards.length > 0 && (
          <MainSection>
            <MainSectionTitle>AWARDS & HONORS</MainSectionTitle>
            {awards.map((award, index) => (
              <div
                key={index}
                style={{ marginBottom: '20px', paddingLeft: '25px' }}
              >
                <WorkTitle>{award.title}</WorkTitle>
                <WorkCompany>
                  {award.awarder}
                  {award.date &&
                    ` - ${new Date(award.date).toLocaleDateString()}`}
                </WorkCompany>
                {award.summary && (
                  <p style={{ marginTop: '8px', color: '#4a4a4a' }}>
                    {award.summary}
                  </p>
                )}
              </div>
            ))}
          </MainSection>
        )}

        {/* References Section */}
        {references.length > 0 && (
          <MainSection>
            <MainSectionTitle>REFERENCE</MainSectionTitle>
            <ReferenceGrid>
              {references.map((ref, index) => (
                <ReferenceCard key={index}>
                  <h3>{ref.name}</h3>
                  <div className="title">{ref.reference}</div>
                </ReferenceCard>
              ))}
            </ReferenceGrid>
          </MainSection>
        )}
      </MainContent>
    </Layout>
  );
}

export default Resume;
