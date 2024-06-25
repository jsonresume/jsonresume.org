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
  font-size-adjust: 0.6;
  font-size: 13px;
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
      <style
        dangerouslySetInnerHTML={{
          __html: `
            body {
                margin: 0;
                padding: 0;
                font-family: 'Open Sans', sans-serif;
            }
            `,
        }}
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
        rel="stylesheet"
      />
    </Layout>
  );
};

export default Resume;
