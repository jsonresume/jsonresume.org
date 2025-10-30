import React from 'react';
/**
 * SkillPill Stories
 * Badge-style skill displays with various styles
 */
import { SkillPill } from './SkillPill';

const meta = {
  title: 'Resume Core/Skills/SkillPill',
  component: SkillPill,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Skill name',
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Pill size',
    },
    rounded: {
      control: 'boolean',
      description: 'Fully rounded corners',
    },
  },
};

export default meta;

export const Default = {
  args: {
    skill: 'React',
  },
};

export const Filled = {
  args: {
    children: 'React',
    variant: 'filled',
    size: 'medium',
    rounded: true,
  },
};

export const Outlined = {
  args: {
    children: 'TypeScript',
    variant: 'outlined',
    size: 'medium',
    rounded: true,
  },
};

export const Small = {
  args: {
    children: 'Node.js',
    variant: 'outlined',
    size: 'small',
    rounded: true,
  },
};

export const SmallFilled = {
  args: {
    children: 'GraphQL',
    variant: 'filled',
    size: 'small',
    rounded: true,
  },
};

export const NotRounded = {
  args: {
    children: 'Docker',
    variant: 'outlined',
    size: 'medium',
    rounded: false,
  },
};

export const SkillCollection = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      <SkillPill variant="filled">JavaScript</SkillPill>
      <SkillPill variant="filled">React</SkillPill>
      <SkillPill variant="filled">TypeScript</SkillPill>
      <SkillPill variant="filled">Node.js</SkillPill>
      <SkillPill variant="filled">GraphQL</SkillPill>
      <SkillPill variant="filled">Docker</SkillPill>
      <SkillPill variant="filled">AWS</SkillPill>
      <SkillPill variant="filled">PostgreSQL</SkillPill>
    </div>
  ),
};

export const OutlinedCollection = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      <SkillPill variant="outlined">HTML5</SkillPill>
      <SkillPill variant="outlined">CSS3</SkillPill>
      <SkillPill variant="outlined">Sass</SkillPill>
      <SkillPill variant="outlined">Tailwind</SkillPill>
      <SkillPill variant="outlined">Jest</SkillPill>
      <SkillPill variant="outlined">Cypress</SkillPill>
      <SkillPill variant="outlined">Git</SkillPill>
      <SkillPill variant="outlined">CI/CD</SkillPill>
    </div>
  ),
};

export const MixedSizes = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        alignItems: 'center',
      }}
    >
      <SkillPill variant="filled" size="medium">
        Expert
      </SkillPill>
      <SkillPill variant="outlined" size="small">
        JavaScript
      </SkillPill>
      <SkillPill variant="outlined" size="small">
        React
      </SkillPill>
      <SkillPill variant="outlined" size="small">
        TypeScript
      </SkillPill>
      <br />
      <SkillPill variant="filled" size="medium">
        Advanced
      </SkillPill>
      <SkillPill variant="outlined" size="small">
        Node.js
      </SkillPill>
      <SkillPill variant="outlined" size="small">
        Python
      </SkillPill>
      <SkillPill variant="outlined" size="small">
        Docker
      </SkillPill>
    </div>
  ),
};
