import Image from 'next/image';
import Head from 'next/head';

export default function Team() {
  const team = {
    coreTeam: [
      {
        name: 'Mattias Erming',
        avatar: 'https://avatars.githubusercontent.com/u/2502500?&s=50',
        github: 'erming',
        twitter: 'mattiaserming',
      },
      {
        name: 'Roland Sharp',
        avatar: 'https://avatars.githubusercontent.com/u/1858973?&s=50',
        github: 'rolandnsharp',
        twitter: 'rolandnsharp',
      },
      {
        name: 'Thomas Davis',
        avatar: 'https://avatars.githubusercontent.com/u/416209?&s=50',
        github: 'thomasdavis',
        twitter: 'ajaxdavis',
      },
      {
        name: 'Mike Chelen',
        avatar: 'https://avatars.githubusercontent.com/u/30691?&s=50',
        github: 'mchelen',
        twitter: 'mchelen',
      },
      {
        name: 'Mudassir Ali',
        avatar: 'https://avatars.githubusercontent.com/u/1861842?&s=50',
        github: 'mudassir0909',
        twitter: 'guesswhat4951',
      },
      {
        name: 'Peter Dave Hello',
        avatar: 'https://avatars.githubusercontent.com/u/3691490?&s=50',
        github: 'PeterDaveHello',
        twitter: 'PeterDaveHello',
      },
      {
        name: 'Seth Falco',
        avatar: 'https://avatars.githubusercontent.com/u/22801583?&s=50',
        github: 'SethFalco',
      },
    ],
    standardsCommittee: [
      {
        name: 'Daan Debie',
        avatar: 'https://avatars.githubusercontent.com/u/854991?s=50',
        github: 'DandyDev',
      },
      {
        name: 'Ursula Kallio',
        avatar: 'https://avatars.githubusercontent.com/u/1639324?s=50',
        github: 'osg',
      },
      {
        name: 'Walter Doekes',
        avatar: 'https://avatars.githubusercontent.com/u/1225014?s=50',
        github: 'wdoekes',
      },
    ],
  };
  return (
    <>
      <Head>
        <title>Team — JSON Resume</title>
      </Head>
      <header id="header">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <h1>Meet the Team</h1>
            </div>
          </div>
        </div>
      </header>
      <div id="team" className="container">
        <div className="row">
          <div className="col-sm-6 contributing">
            <h2>Contributing</h2>
            <p>
              The entire project is open sourced and split up amongst a number
              of modules which are hosted on GitHub. There are many areas of the
              project that need work:
            </p>
            <ul>
              <li>We need everyone to start making themes</li>
              <li>People who can offer advice on the standard</li>
              <li>
                The standard should be able to export to any format under the
                sun
              </li>
            </ul>
            <p>
              All the code for the project can be found here:
              <br />
              <a href="https://github.com/jsonresume">
                https://github.com/jsonresume
              </a>
            </p>
          </div>
          <div className="col-sm-6 team">
            <h2>The Team</h2>
            <p>
              There are many contributors to JSON Resume, but these are our
              regular members who keep the show running:
            </p>
            <section>
              <h3>Core Team</h3>
              <div className="row">
                {team.coreTeam.map((member) => (
                  <div key={member.github} className="col-lg-6 person">
                    <Image
                      className="avatar"
                      src={member.avatar}
                      alt={`Avatar of ${member.name}.`}
                      width="50"
                      height="50"
                    />
                    <div className="name">{member.name}</div>
                    <a
                      className="github"
                      href={`https://github.com/${member.github}`}
                    >
                      GitHub
                    </a>
                    {member.twitter && (
                      <a
                        className="twitter"
                        href={`https://twitter.com/${member.twitter}`}
                      >
                        Twitter
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h3>Standards Committee</h3>
              <div className="row">
                {team.standardsCommittee.map((member) => (
                  <div key={member.github} className="col-lg-6 person">
                    <Image
                      className="avatar"
                      src={member.avatar}
                      alt={`Avatar of ${member.name}.`}
                      width="50"
                      height="50"
                    />
                    <div className="name">{member.name}</div>
                    <a
                      className="github"
                      href={`https://github.com/${member.github}`}
                    >
                      GitHub
                    </a>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <h2>History</h2>
            <h4 id="history">Generated by ChatGPT</h4>
            <p>
              <strong>Origins and Conceptualization</strong>
              <br />
              JSON Resume was conceived as a solution to the fragmented and
              inconsistent landscape of resume formats. Traditional resumes,
              typically created in formats like Microsoft Word or PDF, often
              suffer from compatibility issues when parsed by different systems.
              Recognizing this problem, Thomas Davis and Roland Sharp initiated
              JSON Resume as an open-source project to create a universal,
              machine-readable format for resumes.
            </p>
            <p>
              <strong>Development Milestones</strong>
              <br />
              The project began gaining momentum in the early 2010s, with
              significant milestones such as the creation of the JSON Resume
              schema, the development of the first CLI tools, and the
              establishment of the JSON Resume registry. These milestones were
              driven by community contributions and the growing recognition of
              the need for a standardized resume format in the tech industry.
            </p>
            <p>
              <strong>Community Involvement</strong>
              <br />
              Community involvement has been a cornerstone of JSON Resume’s
              development. From its inception, the project has relied on
              contributions from developers around the world. These
              contributions have included code, documentation, translations, and
              the creation of themes. The collaborative nature of the project
              has ensured its continuous improvement and adaptation to the
              evolving needs of job seekers and employers.
            </p>
            <br />

            <h4 id="purpose">Purpose</h4>
            <p>
              <strong>Standardization and Interoperability</strong>
              <br />
              The primary purpose of JSON Resume is to standardize the format of
              resumes to ensure they are easily readable and interoperable
              across various platforms. By using JSON, a widely accepted data
              format, JSON Resume makes it possible for resumes to be parsed and
              displayed consistently by different systems.
            </p>
            <p>
              <strong>Flexibility and Customization</strong>
              <br />
              Another key purpose is to provide flexibility and customization.
              Unlike traditional resume formats that can be rigid and difficult
              to adapt, JSON Resume allows users to easily customize their
              resume’s appearance using themes. This flexibility is crucial in a
              diverse job market where different industries and roles may
              require different presentation styles.
            </p>
            <p>
              <strong>Simplifying Resume Management</strong>
              <br />
              JSON Resume simplifies the management of resumes. By storing
              resume data in a structured format, it becomes easy to update,
              modify, and transform resumes as needed. This is particularly
              beneficial for developers and technical professionals who may need
              to frequently update their resumes with new skills and
              experiences.
            </p>
            <br />
            <h4 id="getting-started">Getting Started</h4>
            <p>
              <strong>Creating a JSON Resume</strong>
              <br />
              Getting started with JSON Resume involves creating a resume file
              in JSON format. This file includes various sections such as
              personal details, work experience, education, skills, and
              projects. Users can manually create this file using any text
              editor or use one of the many available tools and editors
              specifically designed for JSON Resume.
            </p>
            <p>
              <strong>Using the CLI</strong>
              <br />
              The JSON Resume CLI (Command Line Interface) is a powerful tool
              that helps users create, validate, and manage their JSON resumes.
              It provides commands to initialize a new resume, validate the
              resume against the JSON Resume schema, and export the resume to
              different formats. The CLI is available on npm and can be
              installed using a simple npm command.
            </p>
            <p>
              <strong>Online Editors</strong>
              <br />
              There are several online editors available for JSON Resume, such
              as Jsonresume.io and Resumake.io. These editors provide a
              user-friendly interface for creating and editing JSON resumes
              without requiring knowledge of JSON syntax. They also offer
              features like live previews and theme selection to help users
              customize their resumes.
            </p>
            <br />
            <h4 id="contributing">Contributing</h4>
            <p>
              <strong>Ways to Contribute</strong>
              <br />
              Contributing to JSON Resume can take many forms. Developers can
              contribute code to the core project, create new themes, or develop
              tools and libraries that integrate with JSON Resume.
              Non-developers can help by improving documentation, translating
              content into different languages, or promoting the project on
              social media and in professional communities.
            </p>
            <p>
              <strong>Submitting Pull Requests</strong>
              <br />
              Contributors can submit pull requests on GitHub to propose changes
              to the project. Each pull request is reviewed by the project
              maintainers, who provide feedback and suggestions. This
              collaborative review process ensures that contributions meet the
              project&#39;s standards and are aligned with its goals.
            </p>
            <p>
              <strong>Community Forums and Discussions</strong>
              <br />
              The JSON Resume community is active on various platforms,
              including GitHub Discussions, Reddit, and Stack Overflow. These
              forums provide a space for users to ask questions, share ideas,
              and collaborate on new features and improvements. Engaging with
              the community is a great way to learn more about the project and
              contribute to its development.
            </p>
            <br />
            <h4 id="themes">Themes</h4>
            <p>
              <strong>Overview of Themes</strong>
              <br />
              Themes are a key feature of JSON Resume that allow users to change
              the appearance of their resume without modifying the underlying
              data. A theme is essentially a template that defines how the
              resume data is displayed. Themes can be simple or complex,
              depending on the design and formatting requirements.
            </p>
            <p>
              <strong>Pre-built Themes</strong>
              <br />
              The JSON Resume project includes several pre-built themes that
              users can apply to their resumes. These themes cover a range of
              styles, from minimalist designs to more elaborate layouts. Users
              can browse and preview these themes on the JSON Resume website or
              through the CLI.
            </p>
            <p>
              <strong>Creating Custom Themes</strong>
              <br />
              For those with specific design preferences, creating a custom
              theme is an option. Custom themes are created using HTML, CSS, and
              JavaScript. The JSON Resume documentation provides guidelines and
              examples to help users develop their own themes. Custom themes can
              be shared with the community by submitting them to the JSON Resume
              registry.
            </p>
            <p>
              <strong>Theme Marketplace</strong>
              <br />
              There is potential for a theme marketplace where designers can
              create and sell premium themes for JSON Resume. This marketplace
              would provide additional revenue opportunities for designers and
              offer users a wider selection of high-quality themes.
            </p>
            <br />
            <h4 id="the-registry">The Registry</h4>
            <p>
              <strong>Function and Benefits</strong>
              <br />
              The JSON Resume registry serves as a central repository for
              publishing and sharing resumes. By submitting a resume to the
              registry, users can generate a unique URL for their resume, making
              it easy to share with potential employers. The registry ensures
              that resumes are always up-to-date and accessible.
            </p>
            <p>
              <strong>Security and Privacy</strong>
              <br />
              Security and privacy are important considerations for the
              registry. Users have control over the visibility of their resumes
              and can choose to make them public or private. The registry also
              implements security measures to protect users’ data and prevent
              unauthorized access.
            </p>
            <p>
              <strong>Integration with Job Boards</strong>
              <br />
              Integrating the registry with job boards and applicant tracking
              systems (ATS) could further streamline the job application
              process. This integration would allow job seekers to submit their
              resumes directly from the registry, ensuring that employers
              receive the most up-to-date version of their resume.
            </p>
            <br />
            <h4 id="agnostic-nature">Agnostic Nature</h4>
            <p>
              <strong>Platform Independence</strong>
              <br />
              JSON Resume’s platform-agnostic design means that it can be used
              across different operating systems, devices, and applications.
              This independence ensures that resumes created in JSON format are
              not tied to any specific software or platform, promoting
              widespread adoption and compatibility.
            </p>
            <p>
              <strong>Interoperability with Other Formats</strong>
              <br />
              While JSON is the primary format used by JSON Resume, the project
              supports interoperability with other formats. Tools and libraries
              are available to convert JSON resumes to formats such as PDF,
              HTML, and Markdown. This interoperability ensures that resumes can
              be easily shared and viewed by anyone, regardless of the tools
              they use.
            </p>
            <p>
              <strong>API and Integration Capabilities</strong>
              <br />
              JSON Resume can be integrated with various applications and
              services through APIs. For example, developers can build
              integrations that automatically update a user’s resume with new
              information from LinkedIn or GitHub. These integrations enhance
              the functionality of JSON Resume and provide a seamless experience
              for users.
            </p>
            <br />
            <h4 id="future-developments">Future Developments</h4>
            <p>
              <strong>Multimedia Integration</strong>
              <br />
              Future developments for JSON Resume could include enhanced support
              for multimedia elements. This could involve the ability to embed
              images, videos, and audio clips within the resume, providing a
              richer and more dynamic representation of a candidate’s skills and
              experiences.
            </p>
            <p>
              <strong>Advanced Analytics</strong>
              <br />
              Advanced analytics features could provide insights into how
              resumes are being viewed and used. This could include metrics on
              the number of views, time spent on different sections, and
              feedback from employers. These analytics could help job seekers
              optimize their resumes for better visibility and impact.
            </p>
            <p>
              <strong>Machine Learning and AI</strong>
              <br />
              The integration of machine learning and AI could offer
              personalized recommendations for improving resumes. For example,
              an AI-powered tool could analyze a resume and suggest changes to
              enhance its readability or tailor it to specific job descriptions.
              Such features would make JSON Resume even more valuable for job
              seekers.
            </p>
            <p>
              <strong>Collaboration Features</strong>
              <br />
              Collaboration features could allow multiple users to work on a
              resume simultaneously. This would be particularly useful for teams
              or individuals seeking feedback from mentors, colleagues, or
              career advisors. Real-time collaboration tools could streamline
              the resume creation and review process.
            </p>
            <br />
            <h4 id="marketing-and-branding">Marketing and Branding</h4>
            <p>
              <strong>Building Awareness</strong>
              <br />
              Effective marketing and branding are crucial for the widespread
              adoption of JSON Resume. Building awareness involves showcasing
              the benefits of JSON Resume through tutorials, webinars, and
              success stories. Collaborating with educational institutions and
              career services can also help reach a wider audience.
            </p>
            <p>
              <strong>Community Engagement</strong>
              <br />
              Engaging with the community through social media, forums, and
              events is essential for fostering a vibrant and active user base.
              Regular updates, feature releases, and community challenges can
              keep users engaged and invested in the project.
            </p>
            <p>
              <strong>Partnerships and Collaborations</strong>
              <br />
              Forming partnerships with job boards, career services, and
              professional organizations can enhance the visibility and
              credibility of JSON Resume. Collaborations with these entities can
              provide additional resources and opportunities for users.
            </p>
            <br />
            <h4 id="competitors-and-comparison">Competitors and Comparison</h4>
            <p>
              <strong>Traditional Formats (Word, PDF)</strong>
              <br />
              Traditional resume formats like Microsoft Word and PDF are widely
              used but come with several limitations. They often suffer from
              compatibility issues and lack flexibility in customization. JSON
              Resume offers a standardized, machine-readable format that
              addresses these shortcomings.
            </p>
            <p>
              <strong>Proprietary Resume Builders</strong>
              <br />
              There are several proprietary resume-building tools available,
              such as Canva and Zety. While these tools offer user-friendly
              interfaces and templates, they often lack the flexibility and
              customization options of JSON Resume. Additionally, JSON Resume’s
              open-source nature means there are no subscription fees or
              lock-in, making it a more accessible option for many users.
            </p>
            <p>
              <strong>LinkedIn Profiles</strong>
              <br />
              LinkedIn profiles are another popular alternative to traditional
              resumes. While LinkedIn offers a powerful platform for networking
              and job searching, it does not provide the same level of
              customization and flexibility as JSON Resume. JSON Resume allows
              users to create personalized resumes tailored to specific job
              applications, whereas LinkedIn profiles are more standardized.
            </p>
            <br />
            <h4 id="side-projects-and-integrations">
              Side Projects and Integrations
            </h4>
            <p>
              <strong>Resumake</strong>
              <br />
              Resumake.io is an online editor that simplifies the process of
              creating a JSON resume. It provides a user-friendly interface and
              various themes, allowing users to generate resumes without
              manually writing JSON code. This tool is particularly useful for
              those who prefer a visual approach to resume creation.
            </p>
            <strong>Reactive Resume</strong>
            <p>
              Reactive Resume is another popular project that builds on the JSON
              Resume format. It offers a highly interactive and customizable
              interface for creating and managing resumes. The project focuses
              on providing a responsive design and advanced customization
              options, making it a valuable tool for job seekers.
            </p>
            <p>
              <strong>Resume CLI</strong>
              <br />
              Resume CLI is a command-line tool that extends the functionality
              of JSON Resume. It allows users to create, validate, and manage
              their resumes directly from the terminal. This tool is especially
              useful for developers who prefer working in a command-line
              environment.
            </p>
            <p>
              <strong>Resume Website Generator</strong>
              <br />
              The Resume Website Generator is a project that enables users to
              create a personal website based on their JSON resume. This tool
              converts the JSON resume into a fully functional website,
              providing an additional platform for showcasing a candidate’s
              skills and experiences.
            </p>
            <br />
            <h4 id="advantages-of-json-resume">Advantages of JSON Resume</h4>
            <p>
              <strong>Consistency and Standardization</strong>
              <br />
              JSON Resume provides a consistent and standardized format that
              ensures resumes are easily readable and interoperable across
              different platforms and systems. This standardization eliminates
              the compatibility issues often encountered with traditional resume
              formats.
            </p>
            <p>
              <strong>Flexibility and Customization</strong>
              <br />
              The ability to customize resumes using themes is a significant
              advantage of JSON Resume. Users can easily change the appearance
              of their resume to suit different industries, roles, or personal
              preferences without altering the underlying data.
            </p>
            <p>
              <strong>Open-Source and Community-Driven</strong>
              <br />
              JSON Resume is an open-source project, meaning it is free to use
              and continuously improved by a global community of contributors.
              This community-driven approach ensures that the project evolves to
              meet the needs of its users and remains at the forefront of resume
              management technology.
            </p>
            <p>
              <strong>Integration and Interoperability</strong>
              <br />
              JSON Resume’s platform-agnostic design and support for various
              formats and integrations make it a versatile tool. Users can
              convert their resumes to different formats, integrate with job
              boards and ATS, and use APIs to enhance functionality.
            </p>
            <br />
            <h3 id="conclusion">Conclusion</h3>
            <p>
              JSON Resume represents a significant advancement in the way
              resumes are created, managed, and shared. Its standardized,
              machine-readable format, combined with the flexibility of themes
              and the power of community contributions, makes it a valuable
              resource for job seekers and developers. With ongoing developments
              and the potential for broader applications, JSON Resume is poised
              to play a pivotal role in the future of resume management. Its
              unique advantages over traditional resume formats and proprietary
              tools highlight its importance in an increasingly digital and
              interconnected world. As the project continues to evolve, it will
              undoubtedly unlock new opportunities and benefits for users around
              the globe.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
