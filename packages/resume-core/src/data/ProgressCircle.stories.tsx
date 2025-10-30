import React from 'react';
/**
 * ProgressCircle Stories
 */
import { ProgressCircle } from './ProgressCircle';

const meta = {
  title: 'Resume Core/Data/ProgressCircle',
  component: ProgressCircle,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 5 } },
    size: { control: { type: 'range', min: 40, max: 150, step: 10 } },
    strokeWidth: { control: { type: 'range', min: 2, max: 12, step: 1 } },
    color: { control: 'color' },
  },
};

export default meta;

export const Default = {
  args: {
    value: 75,
    max: 100,
  },
};

export const WithValue = {
  args: {
    value: 85,
    max: 100,
    label: 'JavaScript',
    showValue: true,
  },
};

export const CustomColor = {
  args: {
    value: 90,
    max: 100,
    color: '#28a745',
    label: 'React',
    showValue: true,
  },
};

export const Large = {
  args: {
    value: 70,
    max: 100,
    size: 120,
    strokeWidth: 10,
    label: 'TypeScript',
    showValue: true,
  },
};

export const Small = {
  args: {
    value: 80,
    max: 100,
    size: 50,
    strokeWidth: 4,
    label: 'Node.js',
  },
};

export const SkillProficiency = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <ProgressCircle value={95} label="Expert" showValue color="#28a745" />
      <ProgressCircle value={80} label="Advanced" showValue color="#007bff" />
      <ProgressCircle
        value={60}
        label="Intermediate"
        showValue
        color="#ffc107"
      />
      <ProgressCircle value={30} label="Beginner" showValue color="#dc3545" />
    </div>
  ),
};

export const TechnologyStack = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
        gap: '1.5rem',
      }}
    >
      <ProgressCircle value={90} label="JavaScript" showValue />
      <ProgressCircle value={85} label="React" showValue color="#61dafb" />
      <ProgressCircle value={80} label="TypeScript" showValue color="#3178c6" />
      <ProgressCircle value={75} label="Node.js" showValue color="#339933" />
      <ProgressCircle value={70} label="Python" showValue color="#3776ab" />
      <ProgressCircle value={65} label="Docker" showValue color="#2496ed" />
    </div>
  ),
};
