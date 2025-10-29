import styled from 'styled-components';
import Hero from './Hero';
import Summary from './Summary';
import Work from './Work';
import Projects from './Projects';
import Education from './Education';
import Certificates from './Certificates';
import Publications from './Publications';
import Awards from './Awards';
import Skills from './Skills';
import Interests from './Interests';
import Languages from './Languages';
import References from './References';
import Volunteer from './Volunteer';

const Layout = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem;

  @media print {
    padding: 0;
  }
`;

const Resume = ({ resume }) => {
  return (
    <Layout>
      <Hero basics={resume.basics} />
      <Summary basics={resume.basics} />
      <Work work={resume.work} />
      <Projects projects={resume.projects} />
      <Education education={resume.education} />
      <Certificates certificates={resume.certificates} />
      <Publications publications={resume.publications} />
      <Awards awards={resume.awards} />
      <Volunteer volunteer={resume.volunteer} />
      <Skills skills={resume.skills} />
      <Languages languages={resume.languages} />
      <Interests interests={resume.interests} />
      <References references={resume.references} />
    </Layout>
  );
};

export default Resume;
