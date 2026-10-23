'use client';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@jsonresume/ui';
import { Copy, ExternalLink, FileText, Trash2 } from 'lucide-react';

export default function DropdownMenuActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Job actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Senior Engineer · Stripe</DropdownMenuLabel>
        <DropdownMenuItem icon={<FileText />}>
          Write cover letter
        </DropdownMenuItem>
        <DropdownMenuItem icon={<ExternalLink />}>
          Open listing
        </DropdownMenuItem>
        <DropdownMenuItem icon={<Copy />} shortcut="⌘C">
          Copy link
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={<Trash2 />} tone="danger">
          Hide this job
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
