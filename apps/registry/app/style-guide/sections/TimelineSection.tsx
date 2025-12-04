import {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineContent,
  TimelineHeading,
  TimelineLine,
} from '@repo/ui';
import { ComponentSection, Example, CodeBlock } from '../components';

export function TimelineSection() {
  return (
    <ComponentSection
      title="Timeline"
      description="Vertical timeline for displaying chronological events."
    >
      <Example title="Basic Timeline">
        <div className="max-w-md">
          <Timeline>
            <TimelineItem>
              <TimelineDot />
              <TimelineContent>
                <TimelineHeading>Started at Company</TimelineHeading>
                <p className="text-sm text-gray-600 mt-1">January 2023</p>
              </TimelineContent>
              <TimelineLine />
            </TimelineItem>
            <TimelineItem>
              <TimelineDot />
              <TimelineContent>
                <TimelineHeading>Promoted to Senior</TimelineHeading>
                <p className="text-sm text-gray-600 mt-1">July 2023</p>
              </TimelineContent>
              <TimelineLine />
            </TimelineItem>
            <TimelineItem>
              <TimelineDot />
              <TimelineContent>
                <TimelineHeading>Led Major Project</TimelineHeading>
                <p className="text-sm text-gray-600 mt-1">December 2023</p>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </div>
      </Example>

      <CodeBlock
        code={`<Timeline>
  <TimelineItem>
    <TimelineDot />
    <TimelineContent>
      <TimelineHeading>Started at Company</TimelineHeading>
      <p className="text-sm text-gray-600 mt-1">January 2023</p>
    </TimelineContent>
    <TimelineLine />
  </TimelineItem>
  <TimelineItem>
    <TimelineDot />
    <TimelineContent>
      <TimelineHeading>Promoted to Senior</TimelineHeading>
      <p className="text-sm text-gray-600 mt-1">July 2023</p>
    </TimelineContent>
  </TimelineItem>
</Timeline>`}
      />
    </ComponentSection>
  );
}
