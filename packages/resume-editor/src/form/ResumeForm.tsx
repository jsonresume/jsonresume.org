import { useAtomValue } from '@effect/atom-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
} from '@jsonresume/ui';
import { useMemo } from 'react';
import type { SectionSpec } from '../model';
import { draftAtom } from '../state';
import { pathKey } from './context';
import { Fields, FieldEditor, List } from './FieldEditor';

/** "3" for a list with entries; nothing otherwise. */
const countOf = (value: unknown) =>
  Array.isArray(value) && value.length > 0 ? value.length : undefined;

/**
 * Every section of the resume as a panel, Basics open first. Panels show
 * how many entries they hold and whether something in them needs fixing.
 */
export function ResumeForm({
  sections,
  issues,
}: {
  sections: ReadonlyArray<SectionSpec>;
  issues: ReadonlyMap<string, string>;
}) {
  const draft = useAtomValue(draftAtom);
  const problems = useMemo(() => {
    const bySection = new Map<string, number>();
    for (const key of issues.keys()) {
      const section = key.split('.')[0] ?? '';
      bySection.set(section, (bySection.get(section) ?? 0) + 1);
    }
    return bySection;
  }, [issues]);
  const valueOf = (key: string) =>
    typeof draft === 'object' && draft !== null && !Array.isArray(draft)
      ? (draft as Record<string, unknown>)[key]
      : undefined;

  return (
    <Accordion type="multiple" defaultValue={['basics']}>
      {sections.map((section) => {
        const value = valueOf(section.key);
        const count = countOf(value);
        const issuesHere = problems.get(section.key);
        return (
          <AccordionItem key={section.key} value={section.key}>
            <AccordionTrigger>
              {section.label}
              {count ? <Badge tone="neutral">{count}</Badge> : null}
              {issuesHere ? (
                <Badge tone="warning">{`${issuesHere} to fix`}</Badge>
              ) : null}
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
                <FieldEditor
                  spec={section}
                  value={value}
                  path={[section.key]}
                />
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export { pathKey };
