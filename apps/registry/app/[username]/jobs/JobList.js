// Install styled-components if you haven't already
// npm install styled-components

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Button from '../../../src/ui/Button';

const JobListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const JobCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const JobTitle = styled.h2`
  margin: 0;
  font-size: 1.5em;
  color: #333;
`;

const JobCompany = styled.h3`
  margin: 0;
  font-size: 1.2em;
  color: #555;
`;

const JobType = styled.span`
  display: inline-block;
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 5px 10px;
  margin-right: 10px;
  font-size: 0.9em;
`;

const JobDate = styled.span`
  display: inline-block;
  font-size: 0.9em;
  color: #999;
`;

const JobDescription = styled.p`
  font-size: 1em;
  color: #666;
`;

const JobLocation = styled.div`
  font-size: 0.9em;
  color: #999;
`;

const JobRemote = styled.div`
  font-size: 0.9em;
  color: #999;
`;

const JobSalary = styled.div`
  font-size: 0.9em;
  color: #999;
`;

const JobExperience = styled.div`
  font-size: 0.9em;
  color: #999;
`;

const JobResponsibilities = styled.ul`
  font-size: 0.9em;
  color: #666;
`;

const JobQualifications = styled.ul`
  font-size: 0.9em;
  color: #666;
`;

const JobSkills = styled.ul`
  font-size: 0.9em;
  color: #666;
`;

const JobList = ({ jobs, makeCoverletter }) => {
  const fullJobs = jobs?.map((job) => {
    const fullJob = JSON.parse(job.gpt_content);
    fullJob.raw = job;
    return fullJob;
  });

  return (
    <JobListContainer>
      {fullJobs?.map((job, index) => (
        <JobCard key={index}>
          <JobTitle>{job.title}</JobTitle>
          <JobCompany>{job.company}</JobCompany>
          <JobType>{job.type}</JobType>
          <JobDate>{job.date}</JobDate>
          <JobDescription>{job.description}</JobDescription>
          <JobLocation>
            {job.location?.address}, {job.location?.city},{' '}
            {job.location?.region}, {job.location?.countryCode},{' '}
            {job.location?.postalCode}
          </JobLocation>
          <JobRemote>Remote: {job.remote}</JobRemote>
          <JobSalary>Salary: {job.salary}</JobSalary>
          <JobExperience>Experience: {job.experience}</JobExperience>
          <JobResponsibilities>
            Responsibilities:
            {job.responsibilities?.map((responsibility, idx) => (
              <li key={idx}>{responsibility}</li>
            ))}
          </JobResponsibilities>
          <JobQualifications>
            Qualifications:
            {job.qualifications?.map((qualification, idx) => (
              <li key={idx}>{qualification}</li>
            ))}
          </JobQualifications>
          <JobSkills>
            Skills:
            {job.skills?.map((skill, idx) => (
              <li key={idx}>
                {skill.name} - {skill.level}
                <ul>
                  {skill.keywords?.map((keyword, kidx) => (
                    <li key={kidx}>{keyword}</li>
                  ))}
                </ul>
              </li>
            ))}
          </JobSkills>
          {job.application}
          <br />
          <br />
          <Link href={job.url || '#'}>Source</Link>
          <br />
          <br />
          <Button
            onClick={() => {
              makeCoverletter(job.raw);
            }}
          >
            Make Cover Letter
          </Button>
        </JobCard>
      ))}
    </JobListContainer>
  );
};

export default JobList;
