import React from 'react';
/**
 * CertificationBadge Stories
 */
import { CertificationBadge } from './CertificationBadge';

const meta = {
  title: 'Resume Core/Certifications/CertificationBadge',
  component: CertificationBadge,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    name: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
  },
};

export const Example = {
  args: {
    name: 'Certified Kubernetes Administrator',
    issuer: 'CNCF',
    date: '2023',
  },
};
