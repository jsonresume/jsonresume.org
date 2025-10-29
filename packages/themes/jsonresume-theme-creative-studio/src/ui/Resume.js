import styled from 'styled-components';
import Projects from './Projects';
import Hero from './Hero';
import Summary from './Summary';
import Education from './Education';
import Work from './Work';
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
  padding: 40px 20px;
  line-height: 1.9;
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
      <Languages languages={resume.languages} />
      <Skills skills={resume.skills} />
      <Interests interests={resume.interests} />
      <References references={resume.references} />
    </Layout>
  );
};

export default Resume;
