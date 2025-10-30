import React from 'react';
/**
 * SkillRating Stories
 * Visual rating system for skills using dots
 */
import { SkillRating } from './SkillRating';

const meta = {
  title: 'Resume Core/Skills/SkillRating',
  component: SkillRating,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    skill: {
      control: 'text',
      description: 'Skill name',
    },
    rating: {
      control: { type: 'range', min: 0, max: 5, step: 1 },
      description: 'Skill rating value',
    },
    max: {
      control: { type: 'range', min: 3, max: 10, step: 1 },
      description: 'Maximum rating value',
    },
    size: {
      control: 'text',
      description: 'Dot size (CSS value)',
    },
  },
};

export default meta;

export const Default = {
  args: {
    skill: 'JavaScript',
    rating: 5,
    max: 5,
  },
};

export const FullRating = {
  args: {
    skill: 'React',
    rating: 5,
    max: 5,
  },
};

export const LowRating = {
  args: {
    skill: 'Python',
    rating: 2,
    max: 5,
  },
};

export const TenPointScale = {
  args: {
    skill: 'TypeScript',
    rating: 7,
    max: 10,
  },
};

export const LargeDots = {
  args: {
    skill: 'Node.js',
    rating: 4,
    max: 5,
    size: '16px',
  },
};

export const SmallDots = {
  args: {
    skill: 'GraphQL',
    rating: 3,
    max: 5,
    size: '8px',
  },
};

export const SkillRatings = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <SkillRating skill="JavaScript" rating={5} max={5} />
      <SkillRating skill="React" rating={5} max={5} />
      <SkillRating skill="TypeScript" rating={4} max={5} />
      <SkillRating skill="Node.js" rating={4} max={5} />
      <SkillRating skill="GraphQL" rating={3} max={5} />
      <SkillRating skill="Docker" rating={3} max={5} />
      <SkillRating skill="Python" rating={2} max={5} />
    </div>
  ),
};

export const VariedScales = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <h4 style={{ marginBottom: '1rem' }}>5-Point Scale</h4>
      <SkillRating skill="Frontend Development" rating={5} max={5} />
      <SkillRating skill="Backend Development" rating={4} max={5} />

      <h4 style={{ marginTop: '2rem', marginBottom: '1rem' }}>
        10-Point Scale
      </h4>
      <SkillRating skill="Software Architecture" rating={8} max={10} />
      <SkillRating skill="Team Leadership" rating={7} max={10} />
    </div>
  ),
};
