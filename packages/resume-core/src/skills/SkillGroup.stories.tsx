import React from 'react';
/**
 * SkillGroup Stories
 * Categorized skills with separator-based display
 */
import { SkillGroup } from './SkillGroup';

const meta = {
  title: 'Resume Core/Skills/SkillGroup',
  component: SkillGroup,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    category: {
      control: 'text',
      description: 'Category name',
    },
    skills: {
      control: 'object',
      description: 'Array of skill names or objects',
    },
    separator: {
      control: 'text',
      description: 'Separator character between skills',
    },
  },
};

export default meta;

export const Default = {
  args: {
    title: 'Programming Languages',
    skills: [
      { name: 'JavaScript', level: 'Expert' },
      { name: 'TypeScript', level: 'Expert' },
      { name: 'Python', level: 'Advanced' },
    ],
  },
};

export const CustomSeparator = {
  args: {
    category: 'Backend',
    skills: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis'],
    separator: '|',
  },
};

export const CommaSeparator = {
  args: {
    category: 'Tools',
    skills: ['Git', 'Docker', 'Kubernetes', 'Jenkins', 'AWS'],
    separator: ',',
  },
};

export const NoCategory = {
  args: {
    skills: [
      'Problem Solving',
      'Team Leadership',
      'Communication',
      'Mentoring',
    ],
    separator: '•',
  },
};

export const ObjectSkills = {
  args: {
    category: 'Programming Languages',
    skills: [
      { name: 'JavaScript' },
      { name: 'TypeScript' },
      { name: 'Python' },
      { name: 'Java' },
    ],
    separator: '•',
  },
};

export const MultipleGroups = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <SkillGroup
        category="Frontend Development"
        skills={[
          'React',
          'Vue.js',
          'Angular',
          'Next.js',
          'TypeScript',
          'JavaScript',
          'HTML5',
          'CSS3',
        ]}
        separator="•"
      />
      <SkillGroup
        category="Backend Development"
        skills={[
          'Node.js',
          'Express',
          'NestJS',
          'Django',
          'FastAPI',
          'PostgreSQL',
          'MongoDB',
        ]}
        separator="•"
      />
      <SkillGroup
        category="DevOps & Tools"
        skills={[
          'Docker',
          'Kubernetes',
          'AWS',
          'GitHub Actions',
          'Terraform',
          'Jenkins',
        ]}
        separator="•"
      />
      <SkillGroup
        category="Soft Skills"
        skills={[
          'Leadership',
          'Communication',
          'Problem Solving',
          'Mentoring',
          'Agile/Scrum',
        ]}
        separator="•"
      />
    </div>
  ),
};

export const CompactLayout = {
  render: () => (
    <div style={{ maxWidth: '500px' }}>
      <SkillGroup
        category="Languages"
        skills={['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust']}
        separator="|"
      />
      <SkillGroup
        category="Frameworks"
        skills={['React', 'Next.js', 'Express', 'NestJS', 'Django']}
        separator="|"
      />
      <SkillGroup
        category="Databases"
        skills={['PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch']}
        separator="|"
      />
    </div>
  ),
};
