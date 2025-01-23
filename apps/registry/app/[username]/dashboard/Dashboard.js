'use client';

import React from 'react';
import {
  Briefcase,
  Code,
  FileText,
  BarChart,
  GraduationCap,
} from 'lucide-react';
import { useResume } from '../../providers/ResumeProvider';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { Badge } from '@repo/ui/components/ui/badge';
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
    topSkillCategories: resume.skills?.map((skill) => skill.name),
    mostRecentSkill: 'React Native',
    topIndustries: ['Technology', 'Finance', 'Healthcare'],
    educationLevel: getEducationLevel(resume),
    geographicMobility: 3,
    careerProgression: careerProgression(resume),
  };
  return ResumeData;
};

const SkillsList = ({ skills }) => {
  if (!skills || skills.length === 0) {
    return <p>No skills listed.</p>;
  }

  return (
    <div className="space-y-4">
      {skills.map((skill, index) => (
        <div key={index} className="border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>
          {skill.level && (
            <p className="text-sm text-gray-600 mb-2">Level: {skill.level}</p>
          )}
          {skill.keywords && skill.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skill.keywords.map((keyword, keywordIndex) => (
                <Badge key={keywordIndex} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const ResumeDashboard = () => {
  const { resume, loading, error } = useResume();

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <div>Error loading dashboard: {error}</div>;
  }

  if (!resume) {
    return <div>No resume found. Create one to see your dashboard.</div>;
  }

  const metrics = getMetrics({ resume });

  return (
    <>
      <div className="min-h-screen p-8">
        <div className="">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{resume.basics?.summary}</p>
            </CardContent>
          </Card>

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
                    {metrics.totalExperience.years} y{' '}
                    {metrics.totalExperience.months} m
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Projects</p>
                  <p className="text-2xl font-bold">{metrics.totalProjects}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Skills</p>
                  <p className="text-2xl font-bold">{metrics.totalSkills}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Certifications</p>
                  <p className="text-2xl font-bold">
                    {metrics.totalCertifications ?? 0}
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
                <p className="text-2xl font-bold">{metrics.educationLevel}</p>
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
                  <p className="text-2xl font-bold">{metrics.totalJobs}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg Job Duration</p>
                  <p className="text-2xl font-bold">
                    {`${metrics.averageJobDuration.years}y ${metrics.averageJobDuration.months}m`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SkillsList skills={resume.skills} />
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
                {metrics.careerProgression.map((job, index) => (
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
