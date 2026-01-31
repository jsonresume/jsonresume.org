import Hero from './Hero.jsx';
import About from './About.jsx';
import Work from './Work.jsx';
import Projects from './Projects.jsx';
import Education from './Education.jsx';
import Skills from './Skills.jsx';

const Resume = ({ resume }) => {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="container">
        <main className="container relative mx-auto scroll-my-12 overflow-auto p-4 print:p-12 md:p-16">
          <section className="mx-auto w-full max-w-2xl space-y-8 bg-white print:space-y-6">
            <Hero basics={resume.basics} />
            <About basics={resume.basics} />
            <Work work={resume.work} />
            <Education education={resume.education} />
            <Skills skills={resume.skills} />
            <Projects projects={resume.projects} />
          </section>
        </main>
      </div>
      {/* <Summary basics={resume.basics} />
      <Experience work={resume.work} />
      <Projects projects={resume.projects} /> */}
    </div>
  );
};

export default Resume;
