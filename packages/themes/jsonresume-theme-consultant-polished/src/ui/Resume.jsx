import styled from 'styled-components';
import Hero from './Hero.jsx';
import Summary from './Summary.jsx';
import Work from './Work.jsx';
import Projects from './Projects.jsx';
import Education from './Education.jsx';
import Certificates from './Certificates.jsx';
import Publications from './Publications.jsx';
import Awards from './Awards.jsx';
import Skills from './Skills.jsx';
import Interests from './Interests.jsx';
import Languages from './Languages.jsx';
import References from './References.jsx';
import Volunteer from './Volunteer.jsx';

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
