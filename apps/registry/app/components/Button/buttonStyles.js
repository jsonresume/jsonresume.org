import { css } from 'styled-components';
import { sizes, fontSizes, colors } from './buttonConfig';

export const buttonStyles = css`
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
