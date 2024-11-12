'use client';

// Button.jsx
import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

const sizes = {
  small: '8px 12px',
  medium: '12px 20px',
  large: '16px 24px',
};

const fontSizes = {
  small: '1.1rem',
  medium: '1.3rem',
  large: '1.5rem',
};

const colors = {
  default: {
    background: '#fff18f',
    color: '#222',
    hoverBackground: '#ffe52d',
    disabledBackground: '#fffdf1',
  },
  success: {
    background: '#7eca00',
    color: '#222',
    hoverBackground: '#b0ff2d',
    disabledBackground: '#fafff1',
  },
  danger: {
    background: '#ff8f9d',
    color: '#222',
    hoverBackground: '#ff2d47',
    disabledBackground: '#fff1f3',
  },
};

const buttonStyles = css`
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: ${(props) => sizes[props.size] || sizes.medium};
  font-size: ${(props) => fontSizes[props.size] || sizes.medium};
  line-height: ${(props) => fontSizes[props.size] || sizes.medium};
  border-radius: 0.25rem;
  color: ${(props) => colors[props.color].color};
  background-color: ${(props) => colors[props.color].background};
  border-color: ${(props) => colors[props.color].background};
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) => colors[props.color].hoverBackground};
    border-color: ${(props) => colors[props.color].hoverBackground};
    color: ${(props) => colors[props.color].color};
  }

  &:disabled,
  &[disabled] {
    background-color: ${(props) => colors[props.color].disabledBackground};
    border-color: ${(props) => colors[props.color].disabledBackground};
    cursor: not-allowed;
    opacity: 0.65;
  }
`;

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
