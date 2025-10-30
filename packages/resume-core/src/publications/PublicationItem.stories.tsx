import React from 'react';
/**
 * PublicationItem Stories
 */
import { PublicationItem } from './PublicationItem';

const meta = {
  title: 'Resume Core/Publications/PublicationItem',
  component: PublicationItem,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    title: 'Scaling Microservices: Lessons from Production',
    publication: 'Tech Engineering Blog',
    date: '2023',
    url: 'https://techblog.example.com/scaling-microservices',
  },
};

export const Example = {
  args: {
    title: 'Introduction to React Server Components',
    publication: 'Modern Web Development Magazine',
    date: 'March 2023',
    url: 'https://webdev.example.com/react-server-components',
  },
};
