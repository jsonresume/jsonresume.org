import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TwoColumnMicroGrid } from './TwoColumnMicroGrid';

const meta: Meta<typeof TwoColumnMicroGrid> = {
  title: 'Layouts/TwoColumnMicroGrid',
  component: TwoColumnMicroGrid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Text-only two-column micro grid with semantic single-column DOM order. Uses CSS column flow for visual presentation while maintaining linear semantic order, making it perfect for ATS-friendly resumes.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TwoColumnMicroGrid>;

export const Default: Story = {
  args: {
    children: (
      <>
        <span>Item 1</span>
        <span>Item 2</span>
        <span>Item 3</span>
        <span>Item 4</span>
        <span>Item 5</span>
        <span>Item 6</span>
      </>
    ),
  },
};

export const SkillsList: Story = {
  args: {
    children: (
      <>
        <span>JavaScript</span>
        <span>TypeScript</span>
        <span>React</span>
        <span>Node.js</span>
        <span>Python</span>
        <span>SQL</span>
        <span>Docker</span>
        <span>AWS</span>
        <span>Git</span>
        <span>CI/CD</span>
      </>
    ),
  },
};

export const CertificationsList: Story = {
  args: {
    children: (
      <>
        <span>AWS Solutions Architect</span>
        <span>Certified Kubernetes Admin</span>
        <span>PMP Certified</span>
        <span>Scrum Master</span>
        <span>CISSP</span>
        <span>CompTIA Security+</span>
      </>
    ),
  },
};

export const CustomGap: Story = {
  args: {
    gap: '16px',
    columnGap: '32px',
    children: (
      <>
        <span>Wide spacing</span>
        <span>Between items</span>
        <span>And columns</span>
        <span>For better readability</span>
      </>
    ),
  },
};

export const ManyItems: Story = {
  args: {
    children: (
      <>
        {Array.from({ length: 20 }, (_, i) => (
          <span key={i}>Skill {i + 1}</span>
        ))}
      </>
    ),
  },
};
