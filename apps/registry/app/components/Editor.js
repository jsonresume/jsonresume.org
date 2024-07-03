'use server';
import SignIn from './SignIn';
import { auth } from '../../auth';
import { Octokit } from 'octokit';
import { find } from 'lodash';
import axios from 'axios';
import ResumeEditor from './ResumeEditor';
import CreateResume from './CreateResume';
// @todo - add json schema to editor
//codesandbox.io/p/sandbox/monaco-editor-json-validation-example-gue0q?file=%2Fsrc%2FApp.js
const sampleResume = {
  basics: {
    name: 'Elon Musk',
    label: 'CEO & Entrepreneur',
    image: '',
    email: 'elon@musk.com',
    phone: '(123) 456-7890',
    url: 'https://elonmusk.com',
    summary:
      'Innovative entrepreneur and engineer with a passion for technology, space exploration, and sustainable energy. Founder and CEO of SpaceX, Tesla, Neuralink, and The Boring Company.',
    location: {
      address: '',
      postalCode: '94025',
      city: 'Menlo Park',
      countryCode: 'US',
      region: 'California',
    },
    profiles: [
      {
        network: 'LinkedIn',
        username: 'elonmusk',
        url: 'https://linkedin.com/in/elonmusk',
      },
      {
        network: 'Twitter',
        username: 'elonmusk',
        url: 'https://twitter.com/elonmusk',
      },
    ],
  },
  work: [
    {
      name: 'SpaceX',
      position: 'Founder, CEO, and Lead Designer',
      url: 'https://spacex.com',
      startDate: '2002-03-01',
      summary:
        'Leading private aerospace manufacturer and space transportation company.',
      highlights: [
        'Developed the Falcon and Starship rockets.',
        'Pioneered reusable rocket technology.',
        'Achieved the first privately-funded spacecraft to reach orbit and return.',
      ],
    },
    {
      name: 'Tesla, Inc.',
      position: 'Co-Founder, CEO, and Product Architect',
      url: 'https://tesla.com',
      startDate: '2004-02-01',
      summary: 'Electric vehicle and clean energy company.',
      highlights: [
        'Designed and launched multiple electric vehicle models.',
        'Developed solar energy products and energy storage solutions.',
        'Achieved widespread adoption of electric vehicles and sustainable energy.',
      ],
    },
    {
      name: 'Neuralink',
      position: 'Co-Founder and CEO',
      url: 'https://neuralink.com',
      startDate: '2016-07-01',
      summary: 'Neurotechnology company developing brain-machine interfaces.',
      highlights: [
        'Developed advanced neural implant technology.',
        'Pioneered research in brain-machine interface applications.',
        'Advancing the future of human cognitive enhancement.',
      ],
    },
    {
      name: 'The Boring Company',
      position: 'Founder',
      url: 'https://boringcompany.com',
      startDate: '2016-12-01',
      summary: 'Infrastructure and tunnel construction services company.',
      highlights: [
        'Developed innovative tunneling technologies.',
        'Constructed test tunnels and proposed urban transportation solutions.',
        'Aimed to reduce urban traffic congestion.',
      ],
    },
  ],
  education: [
    {
      institution: 'University of Pennsylvania',
      url: 'https://upenn.edu',
      area: 'Physics',
      studyType: 'Bachelor of Arts',
      startDate: '1992-09-01',
      endDate: '1995-05-01',
      score: '',
      courses: [],
    },
    {
      institution: 'University of Pennsylvania',
      url: 'https://upenn.edu',
      area: 'Economics',
      studyType: 'Bachelor of Science in Economics from the Wharton School',
      startDate: '1992-09-01',
      endDate: '1995-05-01',
      score: '',
      courses: [],
    },
  ],
  skills: [
    {
      name: 'Leadership',
      level: 'Expert',
      keywords: ['Visionary Leadership', 'Team Building', 'Strategic Planning'],
    },
    {
      name: 'Engineering',
      level: 'Expert',
      keywords: [
        'Aerospace Engineering',
        'Electrical Engineering',
        'Mechanical Engineering',
      ],
    },
    {
      name: 'Entrepreneurship',
      level: 'Expert',
      keywords: ['Startups', 'Innovation', 'Business Development'],
    },
  ],
  languages: [
    {
      language: 'English',
      fluency: 'Native',
    },
    {
      language: 'Afrikaans',
      fluency: 'Conversational',
    },
  ],
  interests: [
    {
      name: 'Space Exploration',
      keywords: ['Mars Colonization', 'Rocket Science', 'Astronomy'],
    },
    {
      name: 'Sustainable Energy',
      keywords: ['Electric Vehicles', 'Solar Energy', 'Battery Technology'],
    },
  ],
  references: [
    {
      name: 'Larry Page',
      reference: 'Co-Founder of Google',
    },
    {
      name: 'Richard Branson',
      reference: 'Founder of Virgin Group',
    },
  ],
};

const RESUME_GIST_NAME = 'resume.json';

export default async function Page() {
  const session = await auth();
  console.log({ session });
  let resume = null;
  let gistId = null;
  let login = null;

  console.log('Hello, %s', { session });
  if (!session) {
    return <SignIn />;
  }

  if (session) {
    const octokit = new Octokit({ auth: session.accessToken });
    const { data } = await octokit.rest.users.getAuthenticated();
    console.log({ data });
    const username = data.login;
    login = username;
    const gists = await octokit.rest.gists.list({ per_page: 100 });

    const resumeUrl = find(gists.data, (f) => {
      return f.files[RESUME_GIST_NAME];
    });

    if (resumeUrl) {
      gistId = resumeUrl.id;
      const fullResumeGistUrl = `https://gist.githubusercontent.com/${username}/${gistId}/raw?cachebust=${new Date().getTime()}`;
      const resumeRes = await axios({
        method: 'GET',
        headers: { 'content-type': 'application/json' },
        url: fullResumeGistUrl,
      });
      resume = resumeRes.data;
    }
  }

  async function updateGist(resume) {
    'use server';
    const octokit = new Octokit({ auth: session.accessToken });

    if (gistId) {
      await octokit.rest.gists.update({
        gist_id: gistId,
        files: {
          [RESUME_GIST_NAME]: {
            content: resume,
          },
        },
      });
    }
    return;
  }

  async function createGist() {
    'use server';
    const octokit = new Octokit({ auth: session.accessToken });

    const response = await octokit.rest.gists.create({
      files: {
        [RESUME_GIST_NAME]: {
          content: JSON.stringify(sampleResume, undefined, 2),
        },
      },
    });

    return response;
  }

  return (
    <div>
      {!session && <SignIn />}
      {session && !resume && <CreateResume createGist={createGist} />}
      {session && resume && (
        <div>
          <ResumeEditor
            login={login}
            resume={JSON.stringify(resume, undefined, 2)}
            updateGist={updateGist}
          />
        </div>
      )}
    </div>
  );
}
