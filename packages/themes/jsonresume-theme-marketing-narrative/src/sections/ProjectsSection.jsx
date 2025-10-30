import React from 'react';
import { Section } from '@resume/core';
import {
  StyledSectionTitle,
  StoryItem,
  Position,
  Narrative,
  Achievements,
  AchievementItem,
} from '../Resume.jsx';

export function ProjectsSection({ projects }) {
  if (!projects?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Featured Campaigns & Projects</StyledSectionTitle>
      {projects.map((project, index) => (
        <StoryItem key={index}>
          <Position>{project.name}</Position>
          {project.description && <Narrative>{project.description}</Narrative>}
          {project.highlights?.length > 0 && (
            <Achievements>
              {project.highlights.map((highlight, i) => (
                <AchievementItem key={i}>{highlight}</AchievementItem>
              ))}
            </Achievements>
          )}
        </StoryItem>
      ))}
    </Section>
  );
}
