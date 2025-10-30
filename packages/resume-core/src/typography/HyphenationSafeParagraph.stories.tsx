import type { Meta, StoryObj } from '@storybook/react';
import { HyphenationSafeParagraph } from './HyphenationSafeParagraph.jsx';

const meta: Meta<typeof HyphenationSafeParagraph> = {
  title: 'Typography/HyphenationSafeParagraph',
  component: HyphenationSafeParagraph,
  tags: ['autodocs'],
  argTypes: {
    lang: {
      control: 'select',
      options: ['en', 'es', 'fr', 'de', 'it', 'pt'],
    },
    color: { control: 'color' },
    textAlign: {
      control: 'select',
      options: ['left', 'center', 'right', 'justify'],
    },
    maxLines: { control: 'number' },
    as: {
      control: 'select',
      options: ['p', 'div', 'span'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof HyphenationSafeParagraph>;

const longText =
  'Implemented comprehensive internationalization framework for enterprise-level applications, incorporating sophisticated multilingual content management capabilities and advanced localization strategies that significantly improved user engagement across global markets.';

export const Default: Story = {
  args: {
    children: longText,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export const JustifiedText: Story = {
  args: {
    children: longText,
    textAlign: 'justify',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '500px' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithMaxLines: Story = {
  args: {
    children:
      'Developed and maintained mission-critical microservices architecture supporting millions of daily transactions. Led technical implementation of containerization strategy and continuous deployment pipelines. Collaborated with product teams to define scalable solutions.',
    maxLines: 2,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '450px' }}>
        <Story />
      </div>
    ),
  ],
};

export const FrenchLanguage: Story = {
  args: {
    children:
      "Développement d'applications web modernes avec React et TypeScript, intégration de microservices et implémentation de solutions d'infrastructure cloud évolutives pour des entreprises internationales.",
    lang: 'fr',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export const SpanishLanguage: Story = {
  args: {
    children:
      'Arquitecto de soluciones con experiencia en desarrollo de aplicaciones empresariales, implementación de metodologías ágiles y liderazgo de equipos multidisciplinarios en proyectos de transformación digital.',
    lang: 'es',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export const GermanLanguage: Story = {
  args: {
    children:
      'Softwareentwickler mit umfangreichen Kenntnissen in der Implementierung skalierbarer Systeme, Cloud-Infrastruktur und kontinuierlicher Integration für unternehmenskritische Anwendungen.',
    lang: 'de',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export const CustomColor: Story = {
  args: {
    children: longText,
    color: '#475569',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export const NarrowColumn: Story = {
  args: {
    children:
      'Spearheaded the architectural transformation of legacy monolithic applications into cloud-native microservices, resulting in improved scalability and maintainability.',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          maxWidth: '250px',
          border: '1px solid #e5e7eb',
          padding: '16px',
        }}
      >
        <Story />
      </div>
    ),
  ],
};
