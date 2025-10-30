import React from 'react';
import styled from 'styled-components';

/**
 * TimelineInline Component
 * Dates rendered inline with connector dash for compact timeline display
 * Uses en dash (–) with narrow no-break spaces for proper typography
 *
 * @component
 * @example
 * <TimelineInline
 *   startDate="2020-01"
 *   endDate="2022-03"
 * />
 *
 * @example
 * // Ongoing position (no end date)
 * <TimelineInline
 *   startDate="2022-03"
 *   endDate={null}
 *   presentLabel="Present"
 * />
 *
 * @example
 * // With custom locale
 * <TimelineInline
 *   startDate="2020-01-15"
 *   endDate="2022-03-30"
 *   locale="fr-FR"
 *   format="long"
 * />
 */

interface TimelineInlineProps {
  /** Start date (ISO string or Date object) */
  startDate: string | Date;
  /** End date (ISO string, Date object, or null for "Present") */
  endDate?: string | Date | null;
  /** Date format style: 'short' (default), 'long', 'numeric' */
  format?: 'short' | 'long' | 'numeric';
  /** BCP 47 locale (e.g., 'en-US', 'fr-FR', 'ar-SA') */
  locale?: string;
  /** Custom label for present/ongoing positions */
  presentLabel?: string;
  /** Numbering system (e.g., 'arab', 'latn', 'hanidec') */
  numberingSystem?: string;
  /** Use en dash (–) instead of hyphen (-) for separator */
  useEnDash?: boolean;
  /** Additional CSS class name */
  className?: string;
}

/**
 * Unicode characters for proper typography
 * EN_DASH: – (U+2013) - used for ranges
 * NARROW_NO_BREAK_SPACE:   (U+202F) - used around dash
 */
const EN_DASH = '\u2013';
const NARROW_NO_BREAK_SPACE = '\u202F';

/**
 * Format a single date using Intl.DateTimeFormat
 */
function formatSingleDate(
  dateStr: string | Date | null | undefined,
  format: 'short' | 'long' | 'numeric',
  locale: string,
  numberingSystem?: string,
  presentLabel?: string
): string {
  if (!dateStr) {
    return presentLabel || getPresentLabel(locale);
  }

  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;

  if (isNaN(date.getTime())) {
    return typeof dateStr === 'string' ? dateStr : '';
  }

  const monthFormats = {
    short: { month: 'short' as const },
    long: { month: 'long' as const },
    numeric: { month: '2-digit' as const },
  };

  const options: Intl.DateTimeFormatOptions = {
    ...monthFormats[format],
    year: 'numeric',
  };

  if (numberingSystem) {
    options.numberingSystem = numberingSystem;
  }

  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
}

/**
 * Get localized "Present" label
 */
function getPresentLabel(locale: string): string {
  const labels: Record<string, string> = {
    en: 'Present',
    'en-US': 'Present',
    'en-GB': 'Present',
    fr: 'Présent',
    'fr-FR': 'Présent',
    es: 'Presente',
    'es-ES': 'Presente',
    de: 'Heute',
    'de-DE': 'Heute',
    it: 'Presente',
    'it-IT': 'Presente',
    pt: 'Presente',
    'pt-BR': 'Presente',
    ja: '現在',
    'ja-JP': '現在',
    zh: '至今',
    'zh-CN': '至今',
    'zh-TW': '至今',
    ko: '현재',
    'ko-KR': '현재',
    ar: 'حاضر',
    'ar-SA': 'حاضر',
  };

  return labels[locale] || labels[locale.split('-')[0]] || 'Present';
}

const InlineContainer = styled.span`
  font-size: var(--resume-size-small, 10pt);
  color: var(--resume-color-secondary, #666);
  white-space: nowrap;
  font-variant-numeric: tabular-nums; /* Consistent number width */

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const DateText = styled.span`
  font-weight: var(--resume-weight-normal, 400);
`;

const Separator = styled.span`
  /* En dash with narrow no-break spaces for proper typography */
  margin: 0;
  padding: 0;
`;

/**
 * TimelineInline
 * Compact inline date range with proper typographic separator
 * Uses en dash (–) with narrow no-break spaces for professional appearance
 */
export function TimelineInline({
  startDate,
  endDate,
  format = 'short',
  locale = 'en-US',
  presentLabel,
  numberingSystem,
  useEnDash = true,
  className,
}: TimelineInlineProps) {
  if (!startDate) return null;

  const start = formatSingleDate(
    startDate,
    format,
    locale,
    numberingSystem,
    presentLabel
  );
  const end = formatSingleDate(
    endDate,
    format,
    locale,
    numberingSystem,
    presentLabel
  );

  // Use en dash with narrow no-break spaces for proper typography
  const separator = useEnDash
    ? `${NARROW_NO_BREAK_SPACE}${EN_DASH}${NARROW_NO_BREAK_SPACE}`
    : ' - ';

  return (
    <InlineContainer
      className={`resume-timeline-inline ${className || ''}`.trim()}
    >
      <DateText>{start}</DateText>
      <Separator>{separator}</Separator>
      <DateText>{end}</DateText>
    </InlineContainer>
  );
}

export default TimelineInline;
