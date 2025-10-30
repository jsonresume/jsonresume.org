import React from 'react';
/**
 * TimelineItem Stories
 */
import { TimelineItem } from './TimelineItem';

const meta = {
  title: 'Resume Core/Timeline/TimelineItem',
  component: TimelineItem,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    title: 'Senior Software Engineer at Tech Corp',
    meta: '2020 - Present',
  },
};

export const WithoutLine = {
  args: {
    title: 'Project Lead',
    meta: '2019',
    showLine: false,
    children: 'Led team of 5 developers',
  },
};

export const CustomMarker = {
  args: {
    title: 'Achievement',
    meta: 'Q2 2023',
    markerColor: '#28a745',
    markerSize: '20px',
    children: 'Awarded Employee of the Quarter',
  },
};

export const Multiple = {
  render: () => (
    <div>
      <TimelineItem
        title="Current Role"
        meta="2020-Present"
        markerColor="#007bff"
      >
        Senior Software Engineer at Tech Corp
      </TimelineItem>
      <TimelineItem
        title="Previous Role"
        meta="2018-2020"
        markerColor="#28a745"
      >
        Software Engineer at StartupCo
      </TimelineItem>
      <TimelineItem title="First Role" meta="2016-2018" markerColor="#ffc107">
        Junior Developer at WebAgency
      </TimelineItem>
    </div>
  ),
};
