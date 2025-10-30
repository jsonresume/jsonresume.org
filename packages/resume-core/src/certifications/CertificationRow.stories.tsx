import type { Meta, StoryObj } from '@storybook/react';
import { CertificationRow } from './CertificationRow';

const meta = {
  title: 'Certifications/CertificationRow',
  component: CertificationRow,
  tags: ['autodocs'],
} satisfies Meta<typeof CertificationRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    issuer: 'AWS',
    name: 'Solutions Architect Associate',
  },
};

export const WithCredentialId: Story = {
  args: {
    issuer: 'AWS',
    name: 'Solutions Architect Associate',
    credentialId: 'CERT-123-456-789',
  },
};

export const WithDate: Story = {
  args: {
    issuer: 'Microsoft',
    name: 'Azure Developer Associate',
    credentialId: 'AZ-204',
    date: '2023-06',
  },
};

export const WithUrl: Story = {
  args: {
    issuer: 'Google',
    name: 'Professional Cloud Architect',
    credentialId: 'GCP-PCA-20230415',
    date: '2023-04',
    url: 'https://google.accredible.com/example',
  },
};

export const Complete: Story = {
  args: {
    issuer: 'CompTIA',
    name: 'Security+ ce Certification',
    credentialId: 'COMP001234567890',
    date: '2024-01',
    url: 'https://comptia.org/certifications/verify',
  },
};

export const LongNames: Story = {
  args: {
    issuer: 'Project Management Institute',
    name: 'Project Management Professional (PMP)',
    credentialId: 'PMI-PMP-2023-123456',
    date: '2023-09',
  },
};
