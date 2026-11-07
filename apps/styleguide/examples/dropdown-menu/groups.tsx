'use client';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@jsonresume/ui';

// A group ties its items to the label above them for screen readers.
export default function DropdownMenuGroups() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Download</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>This draft</DropdownMenuLabel>
          <DropdownMenuItem>resume.json</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Your page, as saved</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <a href="#pdf">PDF</a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="#yaml">YAML</a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="#txt">Plain text</a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
