import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/ui/tabs';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/ui/components/ui/avatar';
import { Button } from '@repo/ui/components/ui/button';
import { Badge } from '@repo/ui/components/ui/badge';
import { MapPin, Award, Phone, Mail, Globe } from 'lucide-react';

// Mock data - replace with actual data from JSONResume
const mockResumeData = {
  basics: {
    name: 'John Doe',
    label: 'Software Developer',
    picture: 'https://example.com/johndoe.jpg',
    email: 'john@example.com',
    phone: '(912) 555-4321',
    website: 'https://johndoe.com',
    location: {
      city: 'San Francisco',
      countryCode: 'US',
    },
    profiles: [
      { network: 'LinkedIn', url: 'https://linkedin.com/in/johndoe' },
      { network: 'GitHub', url: 'https://github.com/johndoe' },
    ],
  },
  work: [
    {
      company: 'Company XYZ',
      position: 'Senior Developer',
      startDate: '2018-01-01',
      endDate: 'Present',
      highlights: [
        'Led team of 5 developers',
        'Increased code coverage by 40%',
      ],
    },
    {
      company: 'Company ABC',
      position: 'Junior Developer',
      startDate: '2015-01-01',
      endDate: '2017-12-31',
      highlights: [
        'Developed new product features',
        'Reduced bug count by 30%',
      ],
    },
  ],
  skills: [
    { name: 'JavaScript', level: 'Expert' },
    { name: 'React', level: 'Advanced' },
    { name: 'Node.js', level: 'Intermediate' },
  ],
  education: [
    {
      institution: 'University of Technology',
      area: 'Computer Science',
      studyType: 'Bachelor',
      startDate: '2011-09-01',
      endDate: '2015-06-01',
    },
  ],
  awards: [
    {
      title: 'Employee of the Year',
      date: '2019-01-01',
      awarder: 'Company XYZ',
    },
  ],
};

// Mock data for the skills chart
const skillsChartData = [
  { name: 'JavaScript', value: 90 },
  { name: 'React', value: 85 },
  { name: 'Node.js', value: 70 },
  { name: 'HTML/CSS', value: 80 },
  { name: 'Python', value: 60 },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={mockResumeData.basics.picture}
                alt={mockResumeData.basics.name}
              />
              <AvatarFallback>
                {mockResumeData.basics.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">
                {mockResumeData.basics.name}
              </h1>
              <p className="text-xl text-muted-foreground">
                {mockResumeData.basics.label}
              </p>
              <div className="flex items-center mt-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span>
                  {mockResumeData.basics.location.city},{' '}
                  {mockResumeData.basics.location.countryCode}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <Button variant="outline" size="sm">
              <Phone className="w-4 h-4 mr-2" />
              {mockResumeData.basics.phone}
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="w-4 h-4 mr-2" />
              {mockResumeData.basics.email}
            </Button>
            <Button variant="outline" size="sm">
              <Globe className="w-4 h-4 mr-2" />
              {mockResumeData.basics.website}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Career Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                {mockResumeData.basics.name} is a {mockResumeData.basics.label}{' '}
                with experience in various technologies and a track record of
                successful projects.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Current Position
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {mockResumeData.work[0].position}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {mockResumeData.work[0].company}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Top Skill
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {mockResumeData.skills[0].name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {mockResumeData.skills[0].level}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
            </CardHeader>
            <CardContent>
              {mockResumeData.work.map((job, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <h3 className="text-lg font-semibold">{job.position}</h3>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                  <p className="text-sm">
                    {job.startDate} - {job.endDate}
                  </p>
                  <ul className="list-disc list-inside mt-2">
                    {job.highlights.map((highlight, i) => (
                      <li key={i} className="text-sm">
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                {mockResumeData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="mr-2 mb-2">
                    {skill.name} - {skill.level}
                  </Badge>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={skillsChartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              {mockResumeData.education.map((edu, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <h3 className="text-lg font-semibold">{edu.institution}</h3>
                  <p className="text-sm">
                    {edu.area}, {edu.studyType}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Awards & Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          {mockResumeData.awards.map((award, index) => (
            <div key={index} className="flex items-center mb-2 last:mb-0">
              <Award className="w-5 h-5 mr-2" />
              <div>
                <p className="font-medium">{award.title}</p>
                <p className="text-sm text-muted-foreground">
                  {award.awarder}, {award.date}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
