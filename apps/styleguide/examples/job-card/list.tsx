'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
  Grid,
  JobCard,
  StatusToggle,
} from '@jsonresume/ui';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

export default function JobCardList() {
  const [status, setStatus] = useState<string | null>(null);
  return (
    <Grid minColumnWidth="18rem" gap={4}>
      <JobCard
        title="Senior Engineer, Payments"
        company="Stripe"
        href="#job-1"
        location="San Francisco"
        remote
        salary="$180k–$220k"
        posted="3 days ago"
        match={87}
        tags={['Go', 'Kafka', 'Postgres']}
        actions={
          <>
            <StatusToggle
              label="Status for Senior Engineer at Stripe"
              value={status}
              onValueChange={setStatus}
              options={[
                { value: 'interested', label: 'Interested' },
                { value: 'hidden', label: 'Hide' },
              ]}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="More actions">
                  <MoreHorizontal aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Write cover letter</DropdownMenuItem>
                <DropdownMenuItem>Copy link</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />
      <JobCard
        title="Staff Frontend Engineer"
        company="Vercel"
        href="#job-2"
        remote
        salary="$200k+"
        posted="1 week ago"
        match={72}
        tags={['React', 'Next.js']}
      />
    </Grid>
  );
}
