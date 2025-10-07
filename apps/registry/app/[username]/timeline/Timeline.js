import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine,
} from '@repo/ui';
import { Briefcase } from 'lucide-react';

const SimpleVerticalTimeline = ({ resume }) => {
  const workExperiences = resume.work || [];

  return (
    <div className="min-h-screen p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            Career Timeline
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div>
            <Timeline positions="center">
              {workExperiences.map((work, index) => {
                const side = index % 2 === 0 ? 'left' : 'right';
                const opposite = side === 'left' ? 'right' : 'left';
                return (
                  <TimelineItem key={index} status="done">
                    <TimelineHeading className="text-2xl" side={side}>
                      {work.name}
                    </TimelineHeading>
                    <TimelineHeading side={opposite} variant="secondary">
                      {work.startDate} - {work.endDate}
                    </TimelineHeading>
                    <TimelineDot status="done" />
                    <TimelineLine done />
                    <TimelineContent className="text-base" side={side}>
                      <span className="font-bold">{work.position}</span> <br />
                      {work.summary}
                    </TimelineContent>
                  </TimelineItem>
                );
              })}

              <TimelineItem>
                <TimelineDot />
                <TimelineHeading>Beginning!</TimelineHeading>
              </TimelineItem>
            </Timeline>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleVerticalTimeline;
