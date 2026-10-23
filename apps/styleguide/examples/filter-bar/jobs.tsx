'use client';

import { Field, FilterBar, SearchField, Select, Switch } from '@jsonresume/ui';
import { useState } from 'react';

const labels: Record<string, string> = {
  fulltime: 'Full-time',
  contract: 'Contract',
  senior: 'Senior',
  lead: 'Lead',
};

export default function FilterBarJobs() {
  const [type, setType] = useState('');
  const [level, setLevel] = useState('');
  const [remote, setRemote] = useState(true);
  const active = [
    type && {
      key: 'type',
      label: labels[type] ?? type,
      onRemove: () => setType(''),
    },
    level && {
      key: 'level',
      label: labels[level] ?? level,
      onRemove: () => setLevel(''),
    },
    remote && {
      key: 'remote',
      label: 'Remote',
      onRemove: () => setRemote(false),
    },
  ].filter((f): f is { key: string; label: string; onRemove: () => void } =>
    Boolean(f)
  );

  return (
    <FilterBar
      active={active}
      resultCount={128 - active.length * 31}
      onClearAll={() => {
        setType('');
        setLevel('');
        setRemote(false);
      }}
    >
      <Field label="Search">
        <SearchField placeholder="Title or company" />
      </Field>
      <Field label="Type">
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Any</option>
          <option value="fulltime">Full-time</option>
          <option value="contract">Contract</option>
        </Select>
      </Field>
      <Field label="Level">
        <Select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">Any</option>
          <option value="senior">Senior</option>
          <option value="lead">Lead</option>
        </Select>
      </Field>
      <Switch
        label="Remote only"
        checked={remote}
        onCheckedChange={setRemote}
      />
    </FilterBar>
  );
}
