import styled from 'styled-components';
import Projects from './Projects';
import Hero from './Hero';
import Summary from './Summary';
import Work from './Work';
import Skills from './Skills';
import Interests from './Interests';

const Layout = styled.div`
  max-width: 660px;
  margin: 0 auto;
  line-height: calc(1ex / 0.32);
`;

const Resume = ({ resume }) => {
  return (
    <Layout>
      <Hero basics={resume.basics} />
      <Summary basics={resume.basics} />
      <Work work={resume.work} />
      <Projects projects={resume.projects} />
      <Skills skills={resume.skills} />
      <Interests interests={resume.interests} />
    </Layout>
  );
};

export default Resume;
