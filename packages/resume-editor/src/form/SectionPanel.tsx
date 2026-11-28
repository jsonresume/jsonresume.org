import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
} from '@jsonresume/ui';
import { memo } from 'react';
import type { SectionSpec } from '../model';
import { Fields, FieldEditor, List } from './FieldEditor';

/** "3" for a list with entries; nothing otherwise. */
const countOf = (value: unknown) =>
  Array.isArray(value) && value.length > 0 ? value.length : undefined;

/**
 * One section of the form as a panel, with how many entries it holds and
 * how many problems. Memoised: typing in one section leaves the others
 * (and their 13 accordion rows) alone.
 */
export const SectionPanel = memo(function SectionPanel({
  section,
  value,
  issues,
}: {
  section: SectionSpec;
  value: unknown;
  issues: number | undefined;
}) {
  const count = countOf(value);
  return (
    <AccordionItem value={section.key} data-path={section.key}>
      {/* Under the page's h1: the sections are its h2s. */}
      <AccordionTrigger level={2}>
        {section.label}
        {count ? <Badge tone="neutral">{count}</Badge> : null}
        {issues ? <Badge tone="warning">{`${issues} to fix`}</Badge> : null}
      </AccordionTrigger>
      <AccordionContent>
        {section.kind === 'list' ? (
          <List
            spec={section}
            value={value}
            path={[section.key]}
            headingLevel={3}
          />
        ) : section.kind === 'group' ? (
          <Fields
            specs={section.fields ?? []}
            value={value}
            path={[section.key]}
          />
        ) : (
          <FieldEditor spec={section} value={value} path={[section.key]} />
        )}
      </AccordionContent>
    </AccordionItem>
  );
});
