import type { Meta, StoryObj } from '@storybook/react';
import { SectionIntroParagraph } from './SectionIntroParagraph.jsx';

const meta: Meta<typeof SectionIntroParagraph> = {
  title: 'Typography/SectionIntroParagraph',
  component: SectionIntroParagraph,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'color' },
    maxWidth: { control: 'text' },
    as: {
      control: 'select',
      options: ['p', 'div', 'span'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof SectionIntroParagraph>;

export const Default: Story = {
  args: {
    children:
      'Senior software engineer with 10+ years of experience building scalable distributed systems and leading cross-functional teams.',
  },
};

export const WithMaxWidth: Story = {
  args: {
    children:
      'Creative problem-solver with a passion for elegant code architecture and mentoring junior developers.',
    maxWidth: '500px',
  },
};

export const CustomColor: Story = {
  args: {
    children:
      'Full-stack developer specializing in modern web technologies and cloud infrastructure.',
    color: '#2563eb',
  },
};

export const LongIntroduction: Story = {
  args: {
    children:
      'Results-driven technology leader with extensive experience in enterprise software development, team building, and product strategy. Proven track record of delivering high-impact solutions that drive business growth and operational efficiency.',
  },
};

export const AsDiv: Story = {
  args: {
    children:
      'DevOps engineer focused on automation, reliability, and continuous improvement.',
    as: 'div',
  },
};
