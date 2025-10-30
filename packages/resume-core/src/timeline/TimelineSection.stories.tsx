import React from 'react';
/**
 * TimelineSection Stories
 */
import { TimelineSection } from './TimelineSection';
import { TimelineItem } from './TimelineItem';

const meta = {
  title: 'Resume Core/Timeline/TimelineSection',
  component: TimelineSection,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const WorkHistory = {
  render: () => (
    <TimelineSection>
      <TimelineItem title="Senior Software Engineer" meta="2020-Present">
        Leading development of cloud-native applications at Tech Corp
      </TimelineItem>
      <TimelineItem title="Software Engineer" meta="2018-2020">
        Full-stack development at StartupCo
      </TimelineItem>
      <TimelineItem title="Junior Developer" meta="2016-2018">
        Front-end development at WebAgency
      </TimelineItem>
    </TimelineSection>
  ),
};

export const Education = {
  render: () => (
    <TimelineSection>
      <TimelineItem title="MS Computer Science" meta="2018">
        Stanford University - Focus: AI/ML
      </TimelineItem>
      <TimelineItem title="BS Computer Engineering" meta="2016">
        MIT - Summa Cum Laude
      </TimelineItem>
    </TimelineSection>
  ),
};
