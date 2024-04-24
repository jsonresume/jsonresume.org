import { Inter } from 'next/font/google';
import Hero from './Hero';
import About from './About';
import Work from './Work';

// import Projects from './Projects';
// import Summary from './Summary';
// import Experience from './Experience';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const Resume = ({ resume }) => {
  return (
    <div className={inter.className}>
      <div className="container">
        <main className="container relative mx-auto scroll-my-12 overflow-auto p-4 print:p-12 md:p-16">
          <section className="mx-auto w-full max-w-2xl space-y-8 bg-white print:space-y-6">
            <Hero basics={resume.basics} />
            <About basics={resume.basics} />
            <Work work={resume.work} />
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
