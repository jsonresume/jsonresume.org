import React from 'react';
import styled from 'styled-components';
import { safeUrl, isExternalUrl } from '../utils/security.js';

/**
 * Link Component
 * Safe link component with security checks
 *
 * @component
 * @example
 * <Link href="https://example.com">Visit Site</Link>
 */

const StyledLink = styled.a`
  color: ${(props) =>
    props.theme?.colors?.link || 'var(--resume-color-link, #0066cc)'};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:visited {
    color: ${(props) =>
      props.theme?.colors?.linkVisited ||
      'var(--resume-color-link-visited, #551a8b)'};
  }

  @media print {
    color: inherit;
    text-decoration: underline;
  }
`;

export function Link({ href, children, className, ...rest }) {
  const safeHref = safeUrl(href);

  if (!safeHref) {
    return <span className={className}>{children}</span>;
  }

  const isExternal = isExternalUrl(safeHref);
  const externalProps = isExternal
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <StyledLink
      href={safeHref}
      className={`resume-link ${className || ''}`.trim()}
      {...externalProps}
      {...rest}
    >
      {children}
    </StyledLink>
  );
}

export default Link;
