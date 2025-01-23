'use client';

import { useState } from 'react';
import { useResume } from '../providers/ResumeProvider';

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

export default function CreateResume() {
  const [creating, setCreating] = useState(false);
  const { createGist } = useResume();

  const handleCreateResume = async () => {
    try {
      setCreating(true);
      await createGist(sampleResume);
      window.location.reload();
    } catch (error) {
      console.error('Error creating resume:', error);
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 pt-20">
      <div className="bg-white p-12 rounded-lg shadow-lg text-center max-w-md">
        <p className="text-xl mb-8">
          It looks like you don&apos;t have a gist named{' '}
          <strong>resume.json</strong> yet. No worries! You can easily create
          one right here. Once created, you&apos;ll find it at{' '}
          <a
            href="https://gist.github.com"
            className="text-secondary-500 hover:text-secondary-700"
          >
            gist.github.com
          </a>
          .
        </p>
        {!creating ? (
          <button
            onClick={handleCreateResume}
            className="bg-accent-500 text-white text-lg py-3 px-6 rounded-lg shadow-md hover:bg-accent-700 transition duration-300"
          >
            Create resume.json gist
          </button>
        ) : (
          <div className="text-xl text-secondary-700 mt-4">
            Creating your resume.json gist...
          </div>
        )}
      </div>
    </div>
  );
}
