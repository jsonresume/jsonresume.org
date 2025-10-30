import type { Meta, StoryObj } from '@storybook/react';
import { RoleBlockFramed } from './RoleBlockFramed.jsx';

const meta: Meta<typeof RoleBlockFramed> = {
  title: 'Containers/RoleBlockFramed',
  component: RoleBlockFramed,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'accent', 'tinted', 'minimal'],
    },
    padding: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    spacing: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof RoleBlockFramed>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <h3 style={{ marginTop: 0, marginBottom: '8px' }}>
          Senior Software Engineer
        </h3>
        <p style={{ margin: '4px 0', color: '#666' }}>
          Tech Company Inc. • 2020-2023 • San Francisco, CA
        </p>
        <ul style={{ marginTop: '8px', marginBottom: 0 }}>
          <li>
            Led development of customer analytics platform serving 5M+ users
          </li>
          <li>
            Architected microservices infrastructure handling 50M daily requests
          </li>
          <li>
            Mentored team of 5 junior engineers through code reviews and pair
            programming
          </li>
          <li>
            Reduced infrastructure costs by 35% through optimization and caching
            strategies
          </li>
        </ul>
      </div>
    ),
  },
};

export const AccentVariant: Story = {
  args: {
    variant: 'accent',
    children: (
      <div>
        <h3 style={{ marginTop: 0, marginBottom: '8px' }}>
          Staff Engineer (Featured Role)
        </h3>
        <p style={{ margin: '4px 0', color: '#666' }}>
          Startup Inc. • 2023-Present • Remote
        </p>
        <p style={{ marginTop: '8px', marginBottom: '8px' }}>
          Leading technical architecture for next-generation AI platform:
        </p>
        <ul style={{ marginTop: 0, marginBottom: 0 }}>
          <li>Designed distributed training system processing 100TB+ daily</li>
          <li>Built real-time inference API serving 1M+ requests/minute</li>
          <li>Established ML engineering best practices across organization</li>
        </ul>
      </div>
    ),
  },
};

export const TintedVariant: Story = {
  args: {
    variant: 'tinted',
    children: (
      <div>
        <h3 style={{ marginTop: 0, marginBottom: '8px' }}>Software Engineer</h3>
        <p style={{ margin: '4px 0', color: '#666' }}>
          Enterprise Corp. • 2018-2020 • New York, NY
        </p>
        <ul style={{ marginTop: '8px', marginBottom: 0 }}>
          <li>Developed internal tools used by 1,000+ employees</li>
          <li>Implemented CI/CD pipeline reducing deployment time by 75%</li>
          <li>Contributed to migration from monolith to microservices</li>
        </ul>
      </div>
    ),
  },
};

export const MinimalVariant: Story = {
  args: {
    variant: 'minimal',
    children: (
      <div>
        <h3 style={{ marginTop: 0, marginBottom: '8px' }}>Junior Developer</h3>
        <p style={{ margin: '4px 0', color: '#666' }}>
          Web Agency • 2016-2018 • Seattle, WA
        </p>
        <ul style={{ marginTop: '8px', marginBottom: 0 }}>
          <li>Built responsive websites for 20+ clients</li>
          <li>Maintained WordPress and custom PHP applications</li>
        </ul>
      </div>
    ),
  },
};

export const SmallPadding: Story = {
  args: {
    padding: 'sm',
    children: (
      <div>
        <h4 style={{ marginTop: 0, marginBottom: '6px' }}>Intern</h4>
        <p style={{ margin: '4px 0', color: '#666' }}>
          Tech Startup • Summer 2016 • Remote
        </p>
        <p style={{ margin: '4px 0' }}>
          Built features for mobile app with React Native
        </p>
      </div>
    ),
  },
};

export const LargePadding: Story = {
  args: {
    padding: 'lg',
    children: (
      <div>
        <h3 style={{ marginTop: 0, marginBottom: '8px' }}>
          Principal Engineer
        </h3>
        <p style={{ margin: '4px 0', color: '#666' }}>
          Fortune 500 Company • 2015-2020 • Boston, MA
        </p>
        <p style={{ marginTop: '8px', marginBottom: '8px' }}>
          <strong>Major Achievements:</strong>
        </p>
        <ul style={{ marginTop: 0, marginBottom: '8px' }}>
          <li>Architected platform serving 50M+ users across 20 countries</li>
          <li>Led team of 15 engineers through 3 major product launches</li>
          <li>Reduced technical debt by 60% through systematic refactoring</li>
        </ul>
        <p style={{ margin: '4px 0' }}>
          <strong>Technologies:</strong> Java, Spring Boot, React, AWS,
          Kubernetes, PostgreSQL
        </p>
      </div>
    ),
  },
};

export const CompactSpacing: Story = {
  args: {
    spacing: 'sm',
    padding: 'sm',
    children: (
      <div>
        <h4 style={{ marginTop: 0, marginBottom: '4px' }}>Contractor</h4>
        <p style={{ margin: '2px 0', fontSize: '9pt', color: '#666' }}>
          Various Clients • 2019-2020
        </p>
      </div>
    ),
  },
};

export const LargeSpacing: Story = {
  args: {
    spacing: 'lg',
    children: (
      <div>
        <h3 style={{ marginTop: 0, marginBottom: '8px' }}>
          Distinguished Engineer
        </h3>
        <p style={{ margin: '4px 0', color: '#666' }}>
          Tech Giant • 2010-2015 • Multiple Locations
        </p>
        <ul style={{ marginTop: '8px', marginBottom: 0 }}>
          <li>
            Technical leader for cloud infrastructure serving billions of users
          </li>
        </ul>
      </div>
    ),
  },
};

export const MultipleRoles: Story = {
  render: () => (
    <div>
      <RoleBlockFramed variant="accent">
        <h3 style={{ marginTop: 0 }}>Current Position</h3>
        <p style={{ margin: '4px 0', color: '#666' }}>
          Company A • 2023-Present
        </p>
        <ul style={{ marginTop: '8px', marginBottom: 0 }}>
          <li>Leading team of 10 engineers</li>
          <li>Driving architecture decisions</li>
        </ul>
      </RoleBlockFramed>
      <RoleBlockFramed>
        <h3 style={{ marginTop: 0 }}>Previous Role</h3>
        <p style={{ margin: '4px 0', color: '#666' }}>Company B • 2020-2023</p>
        <ul style={{ marginTop: '8px', marginBottom: 0 }}>
          <li>Built scalable backend systems</li>
          <li>Mentored junior developers</li>
        </ul>
      </RoleBlockFramed>
      <RoleBlockFramed variant="tinted">
        <h3 style={{ marginTop: 0 }}>Earlier Experience</h3>
        <p style={{ margin: '4px 0', color: '#666' }}>Company C • 2018-2020</p>
        <ul style={{ marginTop: '8px', marginBottom: 0 }}>
          <li>Full-stack development</li>
        </ul>
      </RoleBlockFramed>
    </div>
  ),
};
