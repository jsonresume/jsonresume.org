import React from 'react';
/**
 * ExperienceTimeline
 * Timeline-style work experience (wrapper for TimelineItem)
 */
import { TimelineSection, TimelineItem } from '../timeline/index.jsx';

export function ExperienceTimeline({ experiences = [], className }) {
  return (
    <TimelineSection className={className}>
      {experiences.map((exp, index) => (
        <TimelineItem
          key={index}
          title={`${exp.position}${exp.company ? ` at ${exp.company}` : ''}`}
          meta={exp.date}
        >
          {exp.summary}
        </TimelineItem>
      ))}
    </TimelineSection>
  );
}

export default ExperienceTimeline;
