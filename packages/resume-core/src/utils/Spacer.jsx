import React from 'react';
/**
 * Spacer
 * Empty space component for layouts
 */
import styled from 'styled-components';

const StyledSpacer = styled.div`
  width: ${(props) => props.$width || '100%'};
  height: ${(props) => props.$height || 'var(--resume-space-item)'};
  flex-shrink: 0;
`;

export function Spacer({ width, height, className }) {
  return <StyledSpacer $width={width} $height={height} className={className} />;
}

export default Spacer;
