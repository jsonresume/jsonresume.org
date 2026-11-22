import React from 'react';
import { Section, InlineMarkdown } from '@jsonresume/core';
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
          {project.description && (
            <InlineMarkdown as={Narrative} text={project.description} />
          )}
          {project.highlights?.length > 0 && (
            <Achievements>
              {project.highlights.map((highlight, i) => (
                <InlineMarkdown as={AchievementItem} key={i} text={highlight} />
              ))}
            </Achievements>
          )}
        </StoryItem>
      ))}
    </Section>
  );
}
