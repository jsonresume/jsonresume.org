'use client';

import { Stack, StatusToggle, Text, toast } from '@jsonresume/ui';
import { Check, EyeOff, Star } from 'lucide-react';
import { useState } from 'react';

const options = [
  { value: 'interested', label: 'Interested', icon: <Star /> },
  { value: 'read', label: 'Read', icon: <Check /> },
  { value: 'hidden', label: 'Hide', icon: <EyeOff /> },
];

export default function StatusToggleJob() {
  const [status, setStatus] = useState<string | null>('read');
  const change = (next: string | null) => {
    const previous = status;
    setStatus(next);
    if (next === 'hidden') {
      toast({
        title: 'Job hidden',
        action: {
          label: 'Undo',
          altText: 'Undo hiding',
          onClick: () => setStatus(previous),
        },
      });
    }
  };
  return (
    <Stack direction="row" gap={4} align="center" wrap>
      <Text weight="semibold">Senior Engineer · Stripe</Text>
      <StatusToggle
        label="Status for Senior Engineer at Stripe"
        value={status}
        onValueChange={change}
        options={options}
      />
      <StatusToggle
        label="Compact status for Senior Engineer at Stripe"
        value={status}
        onValueChange={change}
        options={options}
        iconOnly
      />
    </Stack>
  );
}
