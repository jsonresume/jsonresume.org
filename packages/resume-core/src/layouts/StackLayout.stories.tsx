import React from 'react';
/**
 * StackLayout Stories
 * Vertical stack layout with consistent spacing
 */
import { StackLayout } from './StackLayout';

const meta = {
  title: 'Resume Core/Layouts/StackLayout',
  component: StackLayout,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    spacing: {
      control: 'text',
      description: 'Gap between stacked items',
    },
  },
};

export default meta;

const Card = ({ title, content }: { title: string; content: string }) => (
  <div
    style={{
      padding: '1rem',
      background: '#f5f5f5',
      borderRadius: '8px',
      border: '1px solid #ddd',
    }}
  >
    <h3>{title}</h3>
    <p>{content}</p>
  </div>
);

export const Default = {
  args: {
    children: 'Stacked content',
  },
};

export const TightSpacing = {
  args: {
    spacing: '0.5rem',
    children: (
      <>
        <Card title="Item 1" content="Tight spacing between items" />
        <Card title="Item 2" content="Compact layout" />
        <Card title="Item 3" content="Space efficient" />
      </>
    ),
  },
};

export const WideSpacing = {
  args: {
    spacing: '2rem',
    children: (
      <>
        <Card title="Item 1" content="Wide spacing between items" />
        <Card title="Item 2" content="Spacious layout" />
        <Card title="Item 3" content="Breathing room" />
      </>
    ),
  },
};

export const WorkExperience = {
  render: () => (
    <StackLayout>
      <div
        style={{
          padding: '1.5rem',
          background: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
        }}
      >
        <h3>Senior Software Engineer</h3>
        <p style={{ color: '#666' }}>
          Tech Corp • 2020-Present • San Francisco, CA
        </p>
        <p>
          Leading development of cloud-native applications serving 1M+ users.
          Built microservices architecture using Node.js and Kubernetes.
        </p>
      </div>
      <div
        style={{
          padding: '1.5rem',
          background: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
        }}
      >
        <h3>Software Engineer</h3>
        <p style={{ color: '#666' }}>StartupCo • 2018-2020 • Remote</p>
        <p>
          Developed full-stack web applications using React and Node.js.
          Implemented CI/CD pipelines and improved deployment process.
        </p>
      </div>
      <div
        style={{
          padding: '1.5rem',
          background: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
        }}
      >
        <h3>Junior Developer</h3>
        <p style={{ color: '#666' }}>WebAgency • 2016-2018 • New York, NY</p>
        <p>
          Built responsive websites for clients using modern web technologies.
          Collaborated with designers to implement pixel-perfect UIs.
        </p>
      </div>
    </StackLayout>
  ),
};

export const ProjectsList = {
  render: () => (
    <StackLayout spacing="1.5rem">
      <div
        style={{
          padding: '1.5rem',
          background: '#f8f9fa',
          borderLeft: '4px solid #007bff',
          borderRadius: '4px',
        }}
      >
        <h3>E-commerce Platform</h3>
        <p>
          Built a full-featured e-commerce platform with React, Node.js, and
          PostgreSQL. Implemented secure payment processing and inventory
          management.
        </p>
      </div>
      <div
        style={{
          padding: '1.5rem',
          background: '#f8f9fa',
          borderLeft: '4px solid #28a745',
          borderRadius: '4px',
        }}
      >
        <h3>Real-time Chat Application</h3>
        <p>
          Developed a real-time chat application using WebSockets and Redis.
          Supports group chats, file sharing, and message history.
        </p>
      </div>
      <div
        style={{
          padding: '1.5rem',
          background: '#f8f9fa',
          borderLeft: '4px solid #ffc107',
          borderRadius: '4px',
        }}
      >
        <h3>Analytics Dashboard</h3>
        <p>
          Created interactive analytics dashboard with D3.js and React.
          Visualizes key metrics and provides actionable insights.
        </p>
      </div>
    </StackLayout>
  ),
};

export const EducationSection = {
  render: () => (
    <StackLayout spacing="1rem">
      <div>
        <h3>Master of Science in Computer Science</h3>
        <p style={{ color: '#666' }}>Stanford University • 2018</p>
        <p>Focus: Machine Learning and Artificial Intelligence</p>
        <p>GPA: 3.9/4.0</p>
      </div>
      <div>
        <h3>Bachelor of Science in Computer Engineering</h3>
        <p style={{ color: '#666' }}>MIT • 2016</p>
        <p>Summa Cum Laude</p>
        <p>GPA: 3.95/4.0</p>
      </div>
    </StackLayout>
  ),
};
