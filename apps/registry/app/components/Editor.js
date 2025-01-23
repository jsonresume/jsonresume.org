'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Octokit } from 'octokit';
import { find } from 'lodash';
import axios from 'axios';
import ResumeEditor from './ResumeEditor';
import CreateResume from './CreateResume';
import { track } from '@vercel/analytics/server';

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

export default function Editor() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const [gistId, setGistId] = useState(null);
  const [login, setLogin] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let debug = {};
      try {
        // Get session from Supabase
        const {
          data: { session: currentSession },
          error: sessionError,
        } = await supabase.auth.getSession();
        debug.sessionError = sessionError;
        debug.hasSession = !!currentSession;
        debug.provider = currentSession?.provider_id;
        debug.providerToken = !!currentSession?.provider_token;
        debug.userMetadata = currentSession?.user?.user_metadata;
        debug.accessToken = currentSession?.access_token;

        setSession(currentSession);
        setDebugInfo(debug);

        if (!currentSession) {
          throw new Error('No session found');
        }

        if (!currentSession.provider_token) {
          throw new Error(
            'No provider token found. This is needed for GitHub API access.',
          );
        }

        // Get GitHub username from user metadata
        const username = currentSession.user?.user_metadata?.user_name;
        debug.username = username;

        if (!username) {
          throw new Error('No GitHub username found in user metadata');
        }

        setLogin(username);

        // Initialize Octokit with the provider token
        const octokit = new Octokit({
          auth: currentSession.provider_token,
        });

        // Test the GitHub API access
        try {
          const { data: userData } =
            await octokit.rest.users.getAuthenticated();
          debug.githubApiTest = 'Success';
          debug.githubUsername = userData.login;
        } catch (githubError) {
          debug.githubApiTest = 'Failed';
          debug.githubError = githubError.message;
          throw githubError;
        }

        // Get user's gists
        const gists = await octokit.rest.gists.list({ per_page: 100 });
        debug.gistsCount = gists.data.length;

        const resumeUrl = find(gists.data, (f) => {
          return f.files[RESUME_GIST_NAME];
        });

        debug.foundResumeGist = !!resumeUrl;

        if (resumeUrl) {
          setGistId(resumeUrl.id);
          debug.gistId = resumeUrl.id;

          const fullResumeGistUrl = `https://gist.githubusercontent.com/${username}/${resumeUrl.id}/raw?cachebust=${new Date().getTime()}`;
          debug.gistUrl = fullResumeGistUrl;

          const resumeRes = await axios({
            method: 'GET',
            headers: { 'content-type': 'application/json' },
            url: fullResumeGistUrl,
          });

          setResume(resumeRes.data);
          debug.resumeDataLoaded = true;
          debug.resumeRes = resumeRes.data;
        }
      } catch (error) {
        debug.error = {
          message: error.message,
          stack: error.stack,
        };
        console.error('Error fetching data:', error);
        setDebugInfo({ ...debug, finalError: error.message });
      } finally {
        setLoading(false);
        setDebugInfo(debug);
      }
    };

    fetchData();
  }, []);

  async function updateGist(resumeContent) {
    try {
      if (!session?.provider_token) {
        throw new Error('No GitHub access token available');
      }
      
      const octokit = new Octokit({ auth: session.provider_token });
      track('ResumeUpdate', { username: login });

      if (gistId) {
        await octokit.rest.gists.update({
          gist_id: gistId,
          files: {
            [RESUME_GIST_NAME]: {
              content: resumeContent,
            },
          },
        });
      } else {
        const { data } = await octokit.rest.gists.create({
          public: true,
          files: {
            [RESUME_GIST_NAME]: {
              content: resumeContent,
            },
          },
        });
        setGistId(data.id);
      }
    } catch (error) {
      console.error('Error updating gist:', error);
      throw error;
    }
  }

  async function createGist() {
    try {
      if (!session?.provider_token) {
        throw new Error('No GitHub access token available');
      }

      track('ResumeCreate', { username: login });
      const octokit = new Octokit({ auth: session.provider_token });

      const { data } = await octokit.rest.gists.create({
        files: {
          [RESUME_GIST_NAME]: {
            content: JSON.stringify(sampleResume, undefined, 2),
          },
        },
        public: true,
      });

      setGistId(data.id);
      return data;
    } catch (error) {
      console.error('Error creating gist:', error);
      throw error;
    }
  }

  if (loading) {
    return (
      <div className="p-4">
        <div>Loading...</div>
        <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto max-h-[500px]">
          Debug Info:
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>
    );
  }

  if (!session || !login) {
    return (
      <div className="p-4">
        <div className="text-red-500">
          Not authenticated or missing GitHub username
        </div>
        <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto max-h-[500px]">
          Debug Info:
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div>
      {resume ? (
        <ResumeEditor
          resume={JSON.stringify(resume, undefined, 2)}
          updateGist={updateGist}
        />
      ) : (
        <div>
          <CreateResume
            sampleResume={sampleResume}
            createGist={createGist}
          />
          <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto max-h-[500px]">
            Debug Info:
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
