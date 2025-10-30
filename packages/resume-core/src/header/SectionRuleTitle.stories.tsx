import React from 'react';
import { SectionRuleTitle } from './SectionRuleTitle';

const meta = {
  title: 'Resume Core/Header/SectionRuleTitle',
  component: SectionRuleTitle,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    children: 'Professional Experience',
  },
};

export const Education = {
  args: {
    children: 'Education & Certifications',
    level: 2,
  },
};

export const PartialRule = {
  args: {
    children: 'Skills',
    ruleWidth: '50%',
  },
};

export const CustomColor = {
  args: {
    children: 'Projects',
    ruleColor: '#2563eb',
  },
};

export const Level3Heading = {
  args: {
    children: 'Technical Expertise',
    level: 3,
  },
};

export const ShortTitle = {
  args: {
    children: 'Awards',
    ruleWidth: '80%',
  },
};
