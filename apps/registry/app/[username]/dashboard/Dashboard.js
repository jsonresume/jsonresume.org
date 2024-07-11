import React from 'react';
import {
  Briefcase,
  Book,
  Award,
  FileText,
  MapPin,
  TrendingUp,
} from 'lucide-react';

const ResumeData = {
  // Assume this object contains all the parsed JSON resume data
  // We'll use placeholder data for this example
  totalExperience: { years: 8, months: 3 },
  totalJobs: 5,
  totalProjects: 12,
  totalSkills: 25,
  totalCertifications: 3,
  totalAwards: 2,
  totalPublications: 1,
  totalVolunteer: 3,
  averageJobDuration: { years: 1, months: 8 },
  mostFrequentJobTitle: 'Software Engineer',
  topSkillCategories: ['Programming', 'Web Development', 'Data Analysis'],
  mostRecentSkill: 'React Native',
  topIndustries: ['Technology', 'Finance', 'Healthcare'],
  educationLevel: "Master's Degree",
  geographicMobility: 3,
  careerProgression: [
    { title: 'Junior Developer', duration: '1 year' },
    { title: 'Software Engineer', duration: '3 years' },
    { title: 'Senior Software Engineer', duration: '2 years' },
    { title: 'Lead Developer', duration: '2 years' },
  ],
  skillEvolution: [
    { year: 2018, skills: ['JavaScript', 'HTML', 'CSS'] },
    { year: 2020, skills: ['React', 'Node.js', 'SQL'] },
    { year: 2022, skills: ['Python', 'Machine Learning', 'React Native'] },
  ],
};

const SectionTitle = ({ children }) => (
  <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b-2 border-blue-500 pb-2">
    {children}
  </h2>
);

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-2 mb-2">
    <Icon className="w-5 h-5 text-blue-500" />
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="text-gray-900">{value}</span>
  </div>
);

const ProgressBar = ({ value, max, label }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-sm font-medium text-gray-700">
        {value}/{max}
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${(value / max) * 100}%` }}
      ></div>
    </div>
  </div>
);

const TimelineItem = ({ title, duration }) => (
  <div className="mb-4">
    <div className="flex items-center mb-1">
      <div className="bg-blue-500 rounded-full w-3 h-3 mr-2"></div>
      <h4 className="text-lg font-semibold">{title}</h4>
    </div>
    <p className="text-sm text-gray-600 ml-5">{duration}</p>
  </div>
);

const SkillBadge = ({ skill }) => (
  <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
    {skill}
  </span>
);

const ResumeDashboard = () => {
  return (
    <div className="w-full p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        THIS DATA ISNT REAL - COMING SOON
      </h1>

      <section className="mb-8">
        <SectionTitle>Overview</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem
            icon={Briefcase}
            label="Total Experience"
            value={`${ResumeData.totalExperience.years}y ${ResumeData.totalExperience.months}m`}
          />
          <InfoItem
            icon={FileText}
            label="Total Projects"
            value={ResumeData.totalProjects}
          />
          <InfoItem
            icon={Award}
            label="Total Skills"
            value={ResumeData.totalSkills}
          />
          <InfoItem
            icon={Award}
            label="Certifications"
            value={ResumeData.totalCertifications}
          />
          <InfoItem
            icon={Book}
            label="Education"
            value={ResumeData.educationLevel}
          />
          <InfoItem
            icon={MapPin}
            label="Relocations"
            value={ResumeData.geographicMobility}
          />
        </div>
      </section>

      <section className="mb-8">
        <SectionTitle>Top Skill Categories</SectionTitle>
        <div className="flex flex-wrap gap-2 mb-4">
          {ResumeData.topSkillCategories.map((category, index) => (
            <SkillBadge key={index} skill={category} />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <SectionTitle>Top Industries</SectionTitle>
        {ResumeData.topIndustries.map((industry, index) => (
          <ProgressBar key={index} value={5 - index} max={5} label={industry} />
        ))}
      </section>

      <section className="mb-8">
        <SectionTitle>Career Progression</SectionTitle>
        <div className="space-y-4">
          {ResumeData.careerProgression.map((job, index) => (
            <TimelineItem
              key={index}
              title={job.title}
              duration={job.duration}
            />
          ))}
        </div>
        <div className="mt-4">
          <InfoItem
            icon={Briefcase}
            label="Total Jobs"
            value={ResumeData.totalJobs}
          />
          <InfoItem
            icon={TrendingUp}
            label="Avg Job Duration"
            value={`${ResumeData.averageJobDuration.years}y ${ResumeData.averageJobDuration.months}m`}
          />
        </div>
      </section>

      <section className="mb-8">
        <SectionTitle>Skills Evolution</SectionTitle>
        {ResumeData.skillEvolution.map((yearSkills, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-semibold mb-2">{yearSkills.year}</h3>
            <div className="flex flex-wrap gap-2">
              {yearSkills.skills.map((skill, skillIndex) => (
                <SkillBadge key={skillIndex} skill={skill} />
              ))}
            </div>
          </div>
        ))}
        <div className="mt-4">
          <InfoItem
            icon={TrendingUp}
            label="Total Skills"
            value={ResumeData.totalSkills}
          />
          <InfoItem
            icon={TrendingUp}
            label="Most Recent Skill"
            value={ResumeData.mostRecentSkill}
          />
        </div>
      </section>
    </div>
  );
};

export default ResumeDashboard;
