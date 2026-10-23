'use client';

import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@jsonresume/ui';
import { useState } from 'react';

const columns = ['Company', 'Location', 'Salary', 'Match'];

export default function DropdownMenuCheckboxes() {
  const [visible, setVisible] = useState(new Set(columns));
  const toggle = (c: string) =>
    setVisible((v) => {
      const next = new Set(v);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Columns ({visible.size})</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Show columns</DropdownMenuLabel>
        {columns.map((c) => (
          <DropdownMenuCheckboxItem
            key={c}
            checked={visible.has(c)}
            onCheckedChange={() => toggle(c)}
            onSelect={(e) => e.preventDefault()}
          >
            {c}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
