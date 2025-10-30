import React from 'react';
/**
 * CardLayout Stories
 * Responsive grid layout for displaying cards
 */
import { CardLayout } from './CardLayout';

const meta = {
  title: 'Resume Core/Layouts/CardLayout',
  component: CardLayout,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    minCardWidth: {
      control: 'text',
      description: 'Minimum card width (CSS value)',
    },
    gap: {
      control: 'text',
      description: 'Gap between cards',
    },
    spacing: {
      control: 'text',
      description: 'Bottom spacing',
    },
  },
};

export default meta;

const ProjectCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div
    style={{
      padding: '1.5rem',
      background: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}
  >
    <h3>{title}</h3>
    <p style={{ color: '#666', marginTop: '0.5rem' }}>{description}</p>
  </div>
);

export const Default = {
  args: {
    children: 'Card content goes here',
  },
};

export const WideCards = {
  args: {
    minCardWidth: '350px',
    children: (
      <>
        <ProjectCard
          title="Project Alpha"
          description="Large-scale distributed system"
        />
        <ProjectCard
          title="Project Beta"
          description="Mobile-first web application"
        />
        <ProjectCard
          title="Project Gamma"
          description="Machine learning pipeline"
        />
      </>
    ),
  },
};

export const NarrowCards = {
  args: {
    minCardWidth: '200px',
    children: (
      <>
        <ProjectCard title="Skill 1" description="JavaScript" />
        <ProjectCard title="Skill 2" description="React" />
        <ProjectCard title="Skill 3" description="Node.js" />
        <ProjectCard title="Skill 4" description="TypeScript" />
      </>
    ),
  },
};

export const CustomGap = {
  args: {
    minCardWidth: '250px',
    gap: '2rem',
    children: (
      <>
        <ProjectCard title="Card 1" description="Wide spacing" />
        <ProjectCard title="Card 2" description="Between cards" />
        <ProjectCard title="Card 3" description="Breathing room" />
      </>
    ),
  },
};

export const ProjectShowcase = {
  render: () => (
    <CardLayout minCardWidth="280px" gap="1.5rem">
      <div
        style={{
          padding: '1.5rem',
          background: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '120px',
            background: '#007bff',
            borderRadius: '4px',
            marginBottom: '1rem',
          }}
        />
        <h3>E-commerce Platform</h3>
        <p style={{ color: '#666' }}>React, Node.js, PostgreSQL</p>
        <p>Full-featured online store with payment processing</p>
      </div>
      <div
        style={{
          padding: '1.5rem',
          background: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '120px',
            background: '#28a745',
            borderRadius: '4px',
            marginBottom: '1rem',
          }}
        />
        <h3>Chat Application</h3>
        <p style={{ color: '#666' }}>WebSocket, Redis, React</p>
        <p>Real-time messaging with group chats</p>
      </div>
      <div
        style={{
          padding: '1.5rem',
          background: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '120px',
            background: '#ffc107',
            borderRadius: '4px',
            marginBottom: '1rem',
          }}
        />
        <h3>Analytics Dashboard</h3>
        <p style={{ color: '#666' }}>D3.js, React, Express</p>
        <p>Interactive data visualization platform</p>
      </div>
      <div
        style={{
          padding: '1.5rem',
          background: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '120px',
            background: '#dc3545',
            borderRadius: '4px',
            marginBottom: '1rem',
          }}
        />
        <h3>Mobile App</h3>
        <p style={{ color: '#666' }}>React Native, Firebase</p>
        <p>Cross-platform mobile application</p>
      </div>
      <div
        style={{
          padding: '1.5rem',
          background: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '120px',
            background: '#6f42c1',
            borderRadius: '4px',
            marginBottom: '1rem',
          }}
        />
        <h3>API Gateway</h3>
        <p style={{ color: '#666' }}>Node.js, Docker, K8s</p>
        <p>Microservices API gateway</p>
      </div>
      <div
        style={{
          padding: '1.5rem',
          background: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '120px',
            background: '#20c997',
            borderRadius: '4px',
            marginBottom: '1rem',
          }}
        />
        <h3>ML Pipeline</h3>
        <p style={{ color: '#666' }}>Python, TensorFlow, AWS</p>
        <p>Machine learning prediction model</p>
      </div>
    </CardLayout>
  ),
};

export const SkillCards = {
  render: () => (
    <CardLayout minCardWidth="200px">
      {[
        'JavaScript',
        'React',
        'Node.js',
        'TypeScript',
        'Python',
        'Docker',
        'AWS',
        'PostgreSQL',
      ].map((skill) => (
        <div
          key={skill}
          style={{
            padding: '1.5rem',
            background: 'white',
            border: '2px solid #007bff',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <h3>{skill}</h3>
          <div style={{ marginTop: '0.5rem', color: '#666' }}>Expert</div>
        </div>
      ))}
    </CardLayout>
  ),
};
