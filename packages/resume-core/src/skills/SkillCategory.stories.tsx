import React from 'react';
/**
 * SkillCategory Stories
 * Categorized skills with hierarchical list display
 */
import { SkillCategory } from './SkillCategory';

const meta = {
  title: 'Resume Core/Skills/SkillCategory',
  component: SkillCategory,
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
      description: 'Array of skills (strings or objects with name and level)',
    },
    showLevel: {
      control: 'boolean',
      description: 'Show skill levels',
    },
  },
};

export default meta;

export const Default = {
  args: {
    category: 'Frontend Development',
    skills: ['React', 'TypeScript', 'CSS', 'HTML5'],
  },
};

export const WithLevels = {
  args: {
    category: 'Programming Languages',
    skills: [
      { name: 'JavaScript', level: 'Expert' },
      { name: 'TypeScript', level: 'Advanced' },
      { name: 'Python', level: 'Intermediate' },
      { name: 'Go', level: 'Beginner' },
    ],
    showLevel: true,
  },
};

export const NumericLevels = {
  args: {
    category: 'Frameworks',
    skills: [
      { name: 'React', level: '5 years' },
      { name: 'Next.js', level: '3 years' },
      { name: 'Express', level: '4 years' },
      { name: 'NestJS', level: '2 years' },
    ],
    showLevel: true,
  },
};

export const NoCategory = {
  args: {
    skills: [
      'Responsive Design',
      'Accessibility',
      'Performance Optimization',
      'SEO',
    ],
    showLevel: false,
  },
};

export const StringSkills = {
  args: {
    category: 'Tools & Technologies',
    skills: [
      'Git',
      'Docker',
      'Kubernetes',
      'Jenkins',
      'AWS',
      'Azure',
      'Terraform',
    ],
    showLevel: false,
  },
};

export const MultipleCategories = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <SkillCategory
        category="Frontend Development"
        skills={[
          { name: 'React', level: 'Expert' },
          { name: 'Vue.js', level: 'Advanced' },
          { name: 'Angular', level: 'Intermediate' },
          { name: 'Next.js', level: 'Advanced' },
        ]}
        showLevel={true}
      />
      <SkillCategory
        category="Backend Development"
        skills={[
          { name: 'Node.js', level: 'Expert' },
          { name: 'Python', level: 'Intermediate' },
          { name: 'Go', level: 'Beginner' },
        ]}
        showLevel={true}
      />
      <SkillCategory
        category="Databases"
        skills={[
          { name: 'PostgreSQL', level: 'Advanced' },
          { name: 'MongoDB', level: 'Advanced' },
          { name: 'Redis', level: 'Intermediate' },
        ]}
        showLevel={true}
      />
    </div>
  ),
};

export const SkillsResume = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <SkillCategory
        category="Programming Languages"
        skills={['JavaScript', 'TypeScript', 'Python', 'Java', 'SQL']}
      />
      <SkillCategory
        category="Frontend Frameworks"
        skills={['React', 'Next.js', 'Vue.js', 'Svelte']}
      />
      <SkillCategory
        category="Backend Frameworks"
        skills={['Node.js', 'Express', 'NestJS', 'Django', 'FastAPI']}
      />
      <SkillCategory
        category="Databases"
        skills={['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Elasticsearch']}
      />
      <SkillCategory
        category="DevOps & Cloud"
        skills={[
          'Docker',
          'Kubernetes',
          'AWS',
          'Azure',
          'GitHub Actions',
          'Terraform',
        ]}
      />
      <SkillCategory
        category="Soft Skills"
        skills={[
          'Team Leadership',
          'Mentoring',
          'Agile/Scrum',
          'Technical Writing',
          'Public Speaking',
        ]}
      />
    </div>
  ),
};

export const YearsOfExperience = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <SkillCategory
        category="Primary Skills"
        skills={[
          { name: 'JavaScript', level: '8 yrs' },
          { name: 'React', level: '6 yrs' },
          { name: 'Node.js', level: '7 yrs' },
          { name: 'TypeScript', level: '5 yrs' },
        ]}
        showLevel={true}
      />
      <SkillCategory
        category="Additional Skills"
        skills={[
          { name: 'Python', level: '3 yrs' },
          { name: 'Docker', level: '4 yrs' },
          { name: 'AWS', level: '3 yrs' },
        ]}
        showLevel={true}
      />
    </div>
  ),
};
