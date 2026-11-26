import { useAtom, useAtomValue } from '@effect/atom-react';
import { Accordion } from '@jsonresume/ui';
import { useEffect, useMemo } from 'react';
import type { SectionSpec } from '../model';
import { draftAtom, goToFieldAtom, openSectionsAtom } from '../state';
import { reveal } from './goTo';
import { pathKey } from './context';
import { SectionPanel } from './SectionPanel';

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
  const [open, setOpen] = useAtom(openSectionsAtom);
  const [goTo, setGoTo] = useAtom(goToFieldAtom);
  // After its section has opened, bring the field asked for into view.
  useEffect(() => {
    if (goTo === null) return;
    const frame = requestAnimationFrame(() => {
      reveal(goTo);
      setGoTo(null);
    });
    return () => cancelAnimationFrame(frame);
  }, [goTo, setGoTo]);
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

  const value = useMemo(() => [...open], [open]);

  return (
    <Accordion type="multiple" value={value} onValueChange={setOpen}>
      {sections.map((section) => (
        <SectionPanel
          key={section.key}
          section={section}
          value={valueOf(section.key)}
          issues={problems.get(section.key)}
        />
      ))}
    </Accordion>
  );
}

export { pathKey };
