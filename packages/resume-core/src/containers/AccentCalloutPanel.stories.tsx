import type { Meta, StoryObj } from '@storybook/react';
import { AccentCalloutPanel } from './AccentCalloutPanel.jsx';

const meta: Meta<typeof AccentCalloutPanel> = {
  title: 'Containers/AccentCalloutPanel',
  component: AccentCalloutPanel,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'info'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof AccentCalloutPanel>;

export const Default: Story = {
  args: {
    title: 'Key Achievement',
    children:
      'Led the successful migration of a monolithic application to microservices architecture, serving over 10 million users with zero downtime during the transition.',
  },
};

export const WithIcon: Story = {
  args: {
    title: 'Career Milestone',
    icon: '🏆',
    children:
      'Promoted to Senior Engineer after 18 months, recognizing exceptional technical leadership and mentorship contributions.',
  },
};

export const SuccessVariant: Story = {
  args: {
    title: 'Project Success',
    icon: '✓',
    variant: 'success',
    children:
      'Delivered the mobile app redesign 2 weeks ahead of schedule, resulting in a 45% increase in user engagement and 4.8 App Store rating.',
  },
};

export const WarningVariant: Story = {
  args: {
    title: 'Important Note',
    icon: '⚠',
    variant: 'warning',
    children:
      'Notice period: 4 weeks. Currently on a critical project timeline through end of Q2.',
  },
};

export const InfoVariant: Story = {
  args: {
    title: 'Additional Context',
    icon: 'ℹ',
    variant: 'info',
    children:
      'Open to relocation for the right opportunity. Preferred locations: San Francisco Bay Area, Seattle, or remote.',
  },
};

export const SmallSize: Story = {
  args: {
    title: 'Quick Note',
    size: 'sm',
    children: 'Available for consulting engagements starting Q3 2024.',
  },
};

export const LongContent: Story = {
  args: {
    title: 'Technical Leadership Experience',
    icon: '👥',
    variant: 'info',
    children: (
      <div>
        <p>
          As Engineering Lead, I've guided multiple cross-functional teams
          through complex technical challenges:
        </p>
        <ul style={{ marginTop: '8px', marginBottom: 0 }}>
          <li>Established code review best practices across 4 teams</li>
          <li>Implemented CI/CD pipeline reducing deployment time by 75%</li>
          <li>Mentored 8 engineers who were promoted to senior positions</li>
          <li>Led architecture decisions for 3 major product initiatives</li>
        </ul>
      </div>
    ),
  },
};

export const NoTitle: Story = {
  args: {
    children:
      'This callout panel has no title, just content. Still maintains the distinctive left border and accent styling.',
  },
};
