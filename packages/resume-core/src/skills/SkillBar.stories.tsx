import React from 'react';
/**
 * SkillBar Stories
 * Horizontal bars showing skill proficiency levels
 */
import { SkillBar } from './SkillBar';

const meta = {
  title: 'Resume Core/Skills/SkillBar',
  component: SkillBar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    skill: {
      control: 'text',
      description: 'Skill name',
    },
    level: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
      description: 'Skill proficiency level (0-100)',
    },
    showPercentage: {
      control: 'boolean',
      description: 'Show percentage value',
    },
    color: {
      control: 'color',
      description: 'Custom bar color',
    },
    height: {
      control: 'text',
      description: 'Bar height (CSS value)',
    },
  },
};

export default meta;

export const Default = {
  args: {
    skill: 'JavaScript',
    level: 90,
  },
};

export const WithPercentage = {
  args: {
    skill: 'React',
    level: 90,
    showPercentage: true,
  },
};

export const CustomColor = {
  args: {
    skill: 'TypeScript',
    level: 75,
    showPercentage: true,
    color: '#007acc',
  },
};

export const CustomHeight = {
  args: {
    skill: 'Node.js',
    level: 80,
    showPercentage: true,
    height: '12px',
  },
};

export const LowLevel = {
  args: {
    skill: 'Python',
    level: 25,
    showPercentage: true,
  },
};

export const FullMastery = {
  args: {
    skill: 'HTML/CSS',
    level: 100,
    showPercentage: true,
  },
};

export const SkillSet = {
  render: () => (
    <div style={{ maxWidth: '500px' }}>
      <SkillBar skill="JavaScript" level={90} showPercentage />
      <SkillBar skill="React" level={85} showPercentage />
      <SkillBar skill="TypeScript" level={80} showPercentage />
      <SkillBar skill="Node.js" level={75} showPercentage />
      <SkillBar skill="GraphQL" level={70} showPercentage />
      <SkillBar skill="Docker" level={65} showPercentage />
    </div>
  ),
};

export const ColorVariants = {
  render: () => (
    <div style={{ maxWidth: '500px' }}>
      <SkillBar skill="Frontend" level={90} color="#3b82f6" showPercentage />
      <SkillBar skill="Backend" level={85} color="#10b981" showPercentage />
      <SkillBar skill="DevOps" level={70} color="#f59e0b" showPercentage />
      <SkillBar skill="Design" level={60} color="#ec4899" showPercentage />
    </div>
  ),
};
