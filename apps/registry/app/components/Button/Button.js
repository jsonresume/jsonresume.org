'use client';

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { buttonStyles } from './buttonStyles';

const StyledButton = styled.button`
  ${buttonStyles}
`;

const StyledLink = styled.a`
  ${buttonStyles}
`;

const Button = ({ size, color, href, children, disabled, ...props }) => {
  if (href) {
    return (
      <StyledLink
        href={disabled ? null : href}
        size={size}
        color={color}
        aria-disabled={disabled}
        onClick={(e) => disabled && e.preventDefault()}
        {...props}
      >
        {children}
      </StyledLink>
    );
  } else {
    return (
      <StyledButton size={size} color={color} disabled={disabled} {...props}>
        {children}
      </StyledButton>
    );
  }
};

Button.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['default', 'success', 'danger']),
  href: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Button.defaultProps = {
  size: 'medium',
  color: 'default',
  href: null,
};

export default Button;
