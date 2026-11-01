import { TreeLegend } from '@jsonresume/ui';

/** The map's key: what each kind of square means. */
export function Legend() {
  return (
    <TreeLegend
      items={[
        { tone: 'success', label: 'Yours: skills, strengths' },
        { tone: 'attention', label: 'Asked for, not shown yet' },
        { tone: 'closable', label: 'Your experience; one step away' },
        { tone: 'open', label: 'Roles, jobs and destinations' },
      ]}
    />
  );
}
