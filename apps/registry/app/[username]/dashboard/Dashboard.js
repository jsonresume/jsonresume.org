import React from 'react';
import {
  Briefcase,
  Code,
  FileText,
  BarChart,
  GraduationCap,
} from 'lucide-react';
import { useProfileData } from '../ProfileContext';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';

import { Progress } from '@repo/ui/components/ui/progress';
import {
  totalExperience,
  averageJobDuration,
  careerProgression,
  getEducationLevel,
} from '../../../lib/calculations';

const getMetrics = ({ resume }) => {
  const ResumeData = {
    totalExperience: totalExperience(resume),
    totalJobs: resume.work?.length,
    totalProjects: resume.projects?.length,
    totalSkills: resume.skills?.length,
    totalCertifications: resume.certifications?.length,
    totalAwards: resume.awards?.length,
    totalPublications: resume.publications?.length,
    totalVolunteer: resume.volunteer?.length,
    averageJobDuration: averageJobDuration(resume),
    mostFrequentJobTitle: 'Software Engineer',
    topSkillCategories: ['Programming', 'Web Development', 'Data Analysis'],
    mostRecentSkill: 'React Native',
    topIndustries: ['Technology', 'Finance', 'Healthcare'],
    educationLevel: getEducationLevel(resume),
    geographicMobility: 3,
    careerProgression: careerProgression(resume),
  };
  return ResumeData;
};

const ResumeDashboard = () => {
  const { resume } = useProfileData();
  const ResumeData = getMetrics({ resume });
  return (
    <>
      <div className="min-h-screen p-8">
        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Experience</p>
                  <p className="text-2xl font-bold">
                    {ResumeData.totalExperience.years} y{' '}
                    {ResumeData.totalExperience.months} m
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Projects</p>
                  <p className="text-2xl font-bold">
                    {ResumeData.totalProjects}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Skills</p>
                  <p className="text-2xl font-bold">{ResumeData.totalSkills}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Certifications</p>
                  <p className="text-2xl font-bold">
                    {ResumeData.totalCertifications ?? 0}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {ResumeData.educationLevel}
                </p>
                <p className="text-sm text-gray-500">Highest Degree Achieved</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center">
                  <BarChart className="w-5 h-5 mr-2" />
                  Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Jobs</p>
                  <p className="text-2xl font-bold">{ResumeData.totalJobs}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg Job Duration</p>
                  <p className="text-2xl font-bold">
                    {`${ResumeData.averageJobDuration.years}y ${ResumeData.averageJobDuration.months}m`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Top Skill Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {ResumeData.topSkillCategories.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Career Progression
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ResumeData.careerProgression.map((job, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-1/3">
                      <p className="font-semibold">{job.title}</p>
                      <p className="text-sm text-gray-500">
                        {job.duration.years} years {job.duration.months} months
                      </p>
                    </div>
                    <div className="w-2/3">
                      <Progress
                        value={
                          (parseInt(job.duration.years) +
                            parseInt(job.duration.months / 12)) *
                          5
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ResumeDashboard;
