import React from 'react';
import { Resume as ResumeProps } from './types';
import { Basics } from './Basics';
import { Volunteer } from './Volunteer';
import { Education } from './Education';
import { Awards } from './Awards';
import { Certificates } from './Certificates';
import { Interests } from './Interests';
import { Languages } from './Languages';
import { Projects } from './Projects';
import { Publications } from './Publications';
import { References } from './References';
import { Skills } from './Skills';
import { Work } from './Work';

export const Resume: React.FC<ResumeProps> = (resume) => (
  <div id="resume">
    <Basics {...resume.basics} />
    {resume.skills && <Skills skills={resume.skills} />}
    {resume.work && <Work work={resume.work} />}
    {resume.projects && <Projects projects={resume.projects} />}
    {resume.volunteer && <Volunteer volunteer={resume.volunteer} />}
    {resume.education && <Education education={resume.education} />}
    {resume.awards && <Awards awards={resume.awards} />}
    {resume.certificates && <Certificates certificates={resume.certificates} />}
    {resume.publications && <Publications publications={resume.publications} />}
    {resume.languages && <Languages languages={resume.languages} />}
    {resume.interests && <Interests interests={resume.interests} />}
    {resume.references && <References references={resume.references} />}
  </div>
);
