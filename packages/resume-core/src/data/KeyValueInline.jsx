import React from 'react';
import styled from 'styled-components';

/**
 * KeyValueInline Component
 * Comma-separated key:value snippets with no-wrap after colon
 * Ideal for displaying metadata, technologies, or specifications inline
 *
 * @component
 * @example
 * <KeyValueInline pairs={[
 *   { key: 'Stack', value: 'React + Node.js' },
 *   { key: 'Team', value: '5 engineers' },
 *   { key: 'Duration', value: '8 months' }
 * ]} />
 */

const Container = styled.span`
  display: inline;
  font-size: ${(props) => {
    if (props.$size === 'xs') return '9pt';
    if (props.$size === 'md') return '11pt';
    return '10pt'; // default sm
  }};
  color: ${(props) =>
    props.theme?.colors?.secondary || 'var(--resume-color-secondary, #333)'};
  line-height: 1.5;

  @media print {
    color: #333;
  }
`;

const KeyValuePair = styled.span`
  display: inline;
  white-space: normal;
`;

const Key = styled.span`
  font-weight: ${(props) =>
    props.theme?.typography?.weightMedium ||
    'var(--resume-weight-medium, 500)'};
  color: ${(props) =>
    props.theme?.colors?.primary || 'var(--resume-color-primary, #000)'};

  @media print {
    font-weight: 500;
    color: #000;
  }
`;

const Colon = styled.span`
  /* Prevent wrap between key and colon */
  white-space: nowrap;

  &::after {
    content: ':';
    margin-right: 0.25em;
  }
`;

const Value = styled.span`
  /* Prevent wrap immediately after colon */
  display: inline-block;
  color: inherit;
`;

const Separator = styled.span`
  &::before {
    content: ', ';
    white-space: pre;
  }
`;

/**
 * Single Key-Value Pair
 *
 * @param {Object} props
 * @param {string} props.keyLabel - The key/label text
 * @param {string} props.value - The value text
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 */
export function KeyValue({ keyLabel, value, className, ...rest }) {
  if (!keyLabel || !value) return null;

  return (
    <KeyValuePair
      className={`resume-key-value ${className || ''}`.trim()}
      {...rest}
    >
      <Key>{keyLabel}</Key>
      <Colon />
      <Value>{value}</Value>
    </KeyValuePair>
  );
}

/**
 * Inline list of key-value pairs
 *
 * @param {Object} props
 * @param {Array<{key: string, value: string}>} [props.pairs] - Array of key-value objects
 * @param {React.ReactNode} [props.children] - Alternative: manual KeyValue children
 * @param {'xs'|'sm'|'md'} [props.size='sm'] - Size variant
 * @param {string} [props.separator=', '] - Separator between pairs
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 */
export function KeyValueInline({
  children,
  pairs,
  size = 'sm',
  separator = ', ',
  className,
  ...rest
}) {
  // Support both pairs array (convenience) and children (manual composition)
  const content = pairs
    ? pairs
        .filter((pair) => pair.key && pair.value)
        .map((pair, index, arr) => (
          <React.Fragment key={index}>
            <KeyValue keyLabel={pair.key} value={pair.value} />
            {index < arr.length - 1 && <Separator aria-hidden="true" />}
          </React.Fragment>
        ))
    : React.Children.toArray(children).map((child, index, arr) => (
        <React.Fragment key={index}>
          {child}
          {index < arr.length - 1 && <Separator aria-hidden="true" />}
        </React.Fragment>
      ));

  if (!content || (Array.isArray(content) && content.length === 0)) {
    return null;
  }

  return (
    <Container
      $size={size}
      className={`resume-key-value-inline ${className || ''}`.trim()}
      {...rest}
    >
      {content}
    </Container>
  );
}

export default KeyValueInline;
