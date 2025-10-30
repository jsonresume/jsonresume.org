import React from 'react';
import styled from 'styled-components';

/**
 * Section Component
 * Semantic <section> wrapper for resume sections with consistent spacing
 *
 * @component
 * @example
 * <Section id="work-experience">
 *   <SectionTitle>Work Experience</SectionTitle>
 *   <ListItem {...jobData} />
 * </Section>
 */

const StyledSection = styled.section`
  margin-bottom: ${(props) =>
    props.theme?.spacing?.section || 'var(--resume-space-section, 2rem)'};

  @media print {
    page-break-inside: avoid;
  }
`;

export function Section({ children, className, id, ...rest }) {
  return (
    <StyledSection
      id={id}
      className={`resume-section ${className || ''}`.trim()}
      {...rest}
    >
      {children}
    </StyledSection>
  );
}

export default Section;
