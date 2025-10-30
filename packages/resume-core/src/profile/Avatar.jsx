import React from 'react';
/**
 * Avatar
 * Profile image component
 */
import styled from 'styled-components';

const Image = styled.img`
  width: ${(props) => props.$size || '80px'};
  height: ${(props) => props.$size || '80px'};
  border-radius: ${(props) =>
    props.$rounded ? '50%' : 'var(--resume-radius-md)'};
  object-fit: cover;
  border: ${(props) =>
    props.$border ? `2px solid var(--resume-color-border)` : 'none'};

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const Placeholder = styled.div`
  width: ${(props) => props.$size || '80px'};
  height: ${(props) => props.$size || '80px'};
  border-radius: ${(props) =>
    props.$rounded ? '50%' : 'var(--resume-radius-md)'};
  background-color: var(--resume-color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(${(props) => props.$size || '80px'} / 2);
  color: var(--resume-color-secondary);
  font-weight: var(--resume-weight-semibold);
`;

export function Avatar({
  src,
  alt = '',
  size = '80px',
  rounded = true,
  border = false,
  fallback,
  className,
}) {
  if (!src && !fallback) {
    return (
      <Placeholder $size={size} $rounded={rounded} className={className}>
        {alt?.[0]?.toUpperCase() || '?'}
      </Placeholder>
    );
  }

  return (
    <Image
      src={src || fallback}
      alt={alt}
      $size={size}
      $rounded={rounded}
      $border={border}
      className={className}
    />
  );
}

export default Avatar;
