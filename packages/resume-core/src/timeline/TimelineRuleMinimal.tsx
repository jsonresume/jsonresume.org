import React from 'react';
import styled from 'styled-components';

/**
 * TimelineRuleMinimal Component
 * Simple vertical rule with tick marks for minimal timeline display
 * Designed for ATS-friendly resumes with clear visual hierarchy
 *
 * @component
 * @example
 * <TimelineRuleMinimal
 *   items={[
 *     { date: '2020-01', label: 'Software Engineer' },
 *     { date: '2022-03', label: 'Senior Engineer' }
 *   ]}
 * />
 *
 * @example
 * // With custom styling
 * <TimelineRuleMinimal
 *   items={items}
 *   lineColor="var(--resume-color-accent)"
 *   tickHeight="3pt"
 * />
 */

interface TimelineItem {
  /** Date label displayed next to tick mark */
  date: string;
  /** Optional content/title for this timeline entry */
  label?: string;
  /** Optional additional metadata */
  meta?: string;
}

interface TimelineRuleMinimalProps {
  /** Array of timeline items to display */
  items: TimelineItem[];
  /** Color of the vertical rule (default: --resume-color-border) */
  lineColor?: string;
  /** Height of tick marks (minimum 2pt, default: 2pt) */
  tickHeight?: string;
  /** Width of tick marks (default: 8px) */
  tickWidth?: string;
  /** Additional CSS class name */
  className?: string;
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--resume-space-item, 12pt);

  @media print {
    break-inside: avoid;
  }
`;

const Rule = styled.div<{ $lineColor?: string }>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: ${(props) =>
    props.$lineColor || 'var(--resume-color-border, #ddd)'};

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const Item = styled.div`
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding-left: 20px;
`;

const Tick = styled.div<{ $height?: string; $width?: string; $color?: string }>`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: ${(props) => props.$width || '8px'};
  height: ${(props) => {
    const height = props.$height || '2pt';
    // Ensure minimum 2pt height
    const value = parseFloat(height);
    const unit = height.replace(/[\d.]/g, '');
    return value < 2 && unit === 'pt' ? '2pt' : height;
  }};
  background-color: ${(props) =>
    props.$color || 'var(--resume-color-border, #ddd)'};

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    min-height: 2pt; /* Ensure visibility in print */
  }
`;

const Date = styled.span`
  font-size: var(--resume-size-small, 10pt);
  color: var(--resume-color-secondary, #666);
  font-weight: var(--resume-weight-normal, 400);
  white-space: nowrap;
  flex-shrink: 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

const Label = styled.span`
  font-size: var(--resume-size-body, 11pt);
  color: var(--resume-color-primary, #000);
  font-weight: var(--resume-weight-medium, 500);
`;

const Meta = styled.span`
  font-size: var(--resume-size-small, 10pt);
  color: var(--resume-color-tertiary, #999);
`;

/**
 * TimelineRuleMinimal
 * Displays a vertical timeline with tick marks and minimal styling
 * Perfect for chronological work history or education sections
 */
export function TimelineRuleMinimal({
  items,
  lineColor,
  tickHeight = '2pt',
  tickWidth = '8px',
  className,
}: TimelineRuleMinimalProps) {
  if (!items || items.length === 0) return null;

  return (
    <Container
      className={`resume-timeline-rule-minimal ${className || ''}`.trim()}
    >
      <Rule $lineColor={lineColor} />
      {items.map((item, index) => (
        <Item key={index}>
          <Tick $height={tickHeight} $width={tickWidth} $color={lineColor} />
          <Date>{item.date}</Date>
          <Content>
            {item.label && <Label>{item.label}</Label>}
            {item.meta && <Meta>{item.meta}</Meta>}
          </Content>
        </Item>
      ))}
    </Container>
  );
}

export default TimelineRuleMinimal;
