'use client';

import { Button, Chip, Stack, Text } from '@jsonresume/ui';
import { useState } from 'react';

const initial = ['Remote', 'Senior', 'TypeScript'];

export default function ChipRemovable() {
  const [filters, setFilters] = useState(initial);
  const [salary, setSalary] = useState(true);
  const remove = (f: string) => setFilters((all) => all.filter((x) => x !== f));

  if (filters.length === 0 && !salary)
    return (
      <Stack direction="row" gap={3} align="center">
        <Text tone="muted">No filters.</Text>
        <Button
          size="sm"
          onClick={() => {
            setFilters(initial);
            setSalary(true);
          }}
        >
          Reset
        </Button>
      </Stack>
    );

  return (
    <Stack direction="row" gap={2} wrap>
      {filters.map((f) => (
        <Chip key={f} onRemove={() => remove(f)}>
          {f}
        </Chip>
      ))}
      {salary ? (
        // Rich content needs label, so the button reads "Remove Salary $150k+".
        <Chip label="Salary $150k+" onRemove={() => setSalary(false)}>
          Salary <strong>$150k+</strong>
        </Chip>
      ) : null}
    </Stack>
  );
}
