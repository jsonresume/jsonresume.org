'use server';
import SignIn from './SignIn';
import { auth } from '../../auth';
import { Octokit } from 'octokit';
import { find } from 'lodash';
import axios from 'axios';
import ResumeEditor from './ResumeEditor';
import CreateResume from './CreateResume';
import { track } from '@vercel/analytics/server';
// @todo - add json schema to editor
//codesandbox.io/p/sandbox/monaco-editor-json-validation-example-gue0q?file=%2Fsrc%2FApp.js

const sampleResume = {
  basics: {
    name: 'Thomas Edison',
    label: 'Inventor and Businessman',
    picture: 'https://example.com/photo.jpg',
    email: 'thomas.edison@example.com',
    phone: '(123) 456-7890',
    website: 'https://thomasedison.com',
    summary:
      'Prolific inventor and businessman known for developing many devices that greatly influenced life around the world, including the phonograph, the motion picture camera, and the electric light bulb.',
    location: {
      address: 'Menlo Park',
      postalCode: '12345',
      city: 'Edison',
      countryCode: 'US',
      region: 'New Jersey',
    },
    profiles: [
      {
        network: 'LinkedIn',
        username: 'thomasedison',
        url: 'https://www.linkedin.com/in/thomasedison',
      },
      {
        network: 'Twitter',
        username: 'realThomasEdison',
        url: 'https://twitter.com/realThomasEdison',
      },
    ],
  },
  work: [
    {
      company: 'Edison Electric Light Company',
      position: 'Founder',
      website: 'https://edison.com',
      startDate: '1878-01-01',
      endDate: '1931-10-18',
      summary:
        'Founded the company that brought electric light to households and businesses.',
      highlights: [
        'Invented the first commercially practical incandescent light bulb.',
        'Developed the electric power distribution system.',
      ],
    },
    {
      company: 'General Electric',
      position: 'Co-Founder',
      website: 'https://ge.com',
      startDate: '1892-01-01',
      endDate: '1931-10-18',
      summary:
        'Co-founded General Electric, one of the largest and most diversified industrial corporations in the world.',
      highlights: [
        'Played a key role in the development of electrical power and lighting systems.',
        'Contributed to the advancement of numerous technological innovations.',
      ],
    },
  ],
  volunteer: [
    {
      organization: 'Menlo Park Laboratory',
      position: 'Lead Researcher',
      website: 'https://menloparklab.com',
      startDate: '1876-01-01',
      endDate: '1931-10-18',
      summary:
        'Conducted research and experiments leading to numerous patents and innovations.',
      highlights: [
        'Developed the phonograph, a device for recording and reproducing sound.',
        'Invented the motion picture camera, contributing to the birth of the film industry.',
      ],
    },
  ],
  education: [
    {
      institution: 'Self-Taught',
      area: 'Various fields of science and technology',
      studyType: 'Self-Education',
      startDate: '1859-01-01',
      endDate: '1931-10-18',
      gpa: '',
      courses: [
        'Electrical Engineering',
        'Mechanical Engineering',
        'Chemistry',
      ],
    },
  ],
  awards: [
    {
      title: 'Congressional Gold Medal',
      date: '1928-01-01',
      awarder: 'United States Congress',
      summary:
        'Awarded for distinguished achievements and contributions to society.',
    },
  ],
  publications: [
    {
      name: 'Electric Light and Power',
      publisher: 'Scientific American',
      releaseDate: '1880-01-01',
      website: 'https://scientificamerican.com',
      summary:
        'A paper detailing the development and impact of electric light and power systems.',
    },
  ],
  skills: [
    {
      name: 'Inventing',
      level: 'Master',
      keywords: ['Electricity', 'Sound Recording', 'Motion Pictures'],
    },
    {
      name: 'Entrepreneurship',
      level: 'Expert',
      keywords: [
        'Business Development',
        'Product Innovation',
        'Industrial Research',
      ],
    },
  ],
  languages: [
    {
      language: 'English',
      fluency: 'Native speaker',
    },
  ],
  interests: [
    {
      name: 'Research and Development',
      keywords: ['Innovations', 'Experimentation'],
    },
  ],
  references: [
    {
      name: 'Henry Ford',
      reference:
        'Thomas Edison was a brilliant inventor and a visionary businessman. His work has had a profound impact on the modern world.',
    },
  ],
};

const RESUME_GIST_NAME = 'resume.json';

export default async function Page() {
  const session = await auth();
  let resume = null;
  let gistId = null;
  let login = null;

  if (!session) {
    return <SignIn />;
  }

  if (session) {
    const octokit = new Octokit({ auth: session.accessToken });
    const { data } = await octokit.rest.users.getAuthenticated();
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
    track('ResumeUpdate', { username: login });
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
    track('ResumeCreate', { username: login });
    const octokit = new Octokit({ auth: session.accessToken });

    const response = await octokit.rest.gists.create({
      files: {
        [RESUME_GIST_NAME]: {
          content: JSON.stringify(sampleResume, undefined, 2),
        },
      },
      public: true,
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
