import React from 'react';
import { AchievementListSpacious } from './AchievementListSpacious';

/**
 * AchievementListSpacious Stories
 */

const meta = {
  title: 'Resume Core/Lists/AchievementListSpacious',
  component: AchievementListSpacious,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    items: [
      'Led cross-functional team of 12 engineers and designers to deliver cloud-native platform',
      'Established best practices and coding standards adopted across 3 departments',
      'Reduced technical debt by 40% through systematic refactoring initiatives',
      'Presented at 5 industry conferences on microservices architecture patterns',
    ],
    bullet: '•',
  },
};

export const CustomBullet = {
  args: {
    items: [
      'Architected scalable infrastructure handling 10M+ requests per day',
      'Mentored 8 developers resulting in 5 promotions to senior roles',
      'Implemented security framework achieving SOC 2 Type II compliance',
    ],
    bullet: '→',
  },
};

export const MixedLength = {
  args: {
    items: [
      'Short achievement',
      'This is a longer achievement that spans multiple lines to demonstrate how the spacious list maintains proper baseline grid alignment and visual rhythm throughout the content',
      'Medium length achievement with comfortable spacing',
      'Another concise win',
    ],
  },
};
