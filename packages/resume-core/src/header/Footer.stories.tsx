import React from 'react';
import { Footer } from './Footer';

const meta = {
  title: 'Resume Core/Header/Footer',
  component: Footer,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    children: 'Resume generated with JSONResume.org',
  },
};

export const WithPageNumbers = {
  args: {},
};

export const WithText = {
  args: {},
};
