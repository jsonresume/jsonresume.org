'use client';

import { useResume } from '../providers/ResumeProvider';
import ResumeEditor from './ResumeEditor';
import CreateResume from './CreateResume';
import { FileJson } from 'lucide-react';
import { Badge, Card, CardContent } from '@repo/ui';

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

export default function Editor() {
  const { resume, loading, error, updateGist, createGist } = useResume();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />

        <Card className="max-w-md w-full relative backdrop-blur-xl bg-white/80 border-none shadow-xl">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-6">
                <Badge className="animate-pulse" variant="secondary">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-2" />
                  Loading Resume
                </Badge>
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <FileJson className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  JSON Resume
                </h2>
              </div>
              <p className="text-gray-600 max-w-sm mx-auto">
                Fetching your resume data...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:20px_20px]" />
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />

        <Card className="max-w-md w-full relative backdrop-blur-xl bg-white/80 border-none shadow-xl">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-6">
                <Badge variant="destructive">Error</Badge>
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <FileJson className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  JSON Resume
                </h2>
              </div>
              <p className="text-red-600 max-w-sm mx-auto">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-50 relative overflow-hidden">
      {/* Decorative elements */}

      {resume ? (
        <ResumeEditor
          resume={JSON.stringify(resume, undefined, 2)}
          updateGist={updateGist}
        />
      ) : (
        <CreateResume sampleResume={sampleResume} createGist={createGist} />
      )}
    </div>
  );
}
