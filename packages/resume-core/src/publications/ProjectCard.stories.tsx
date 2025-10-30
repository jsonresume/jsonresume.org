import React from 'react';
/**
 * ProjectCard Stories
 */
import { ProjectCard } from './ProjectCard';

const meta = {
  title: 'Resume Core/Publications/ProjectCard',
  component: ProjectCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    title: 'E-Commerce Platform Redesign',
    description:
      'Led complete redesign of checkout flow, increasing conversion by 35%. Implemented responsive design and improved page load time by 60%.',
    tags: ['React', 'TypeScript', 'AWS'],
    date: '2022 - 2023',
    url: 'https://github.com/example/project',
  },
};

export const Example = {
  args: {
    title: 'Real-time Analytics Dashboard',
    description:
      'Built real-time data visualization platform processing 10M+ events/day. Integrated WebSocket streaming and custom charting library.',
    tags: ['Node.js', 'D3.js', 'MongoDB'],
    date: '2021',
    url: 'https://github.com/example/analytics',
  },
};
