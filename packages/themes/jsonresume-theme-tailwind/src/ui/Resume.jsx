import Hero from './Hero.jsx';
import About from './About.jsx';
import Work from './Work.jsx';
import Volunteer from './Volunteer.jsx';
import Projects from './Projects.jsx';
import Education from './Education.jsx';
import Skills from './Skills.jsx';
import Awards from './Awards.jsx';
import Certificates from './Certificates.jsx';
import Publications from './Publications.jsx';
import Languages from './Languages.jsx';
import Interests from './Interests.jsx';
import References from './References.jsx';

const Resume = ({ resume }) => {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="container">
        <main className="container relative mx-auto scroll-my-12 overflow-auto p-4 print:p-12 md:p-16">
          <section className="mx-auto w-full max-w-2xl space-y-8 bg-white print:space-y-6">
            <Hero basics={resume.basics} />
            <About basics={resume.basics} />
            <Work work={resume.work} />
            <Volunteer volunteer={resume.volunteer} />
            <Education education={resume.education} />
            <Skills skills={resume.skills} />
            <Projects projects={resume.projects} />
            <Awards awards={resume.awards} />
            <Certificates certificates={resume.certificates} />
            <Publications publications={resume.publications} />
            <Languages languages={resume.languages} />
            <Interests interests={resume.interests} />
            <References references={resume.references} />
          </section>
        </main>
      </div>
    </div>
  );
};

export default Resume;
