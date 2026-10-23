import { ActivityFeed } from '@jsonresume/ui';
import { Eye, FileText, Send } from 'lucide-react';

const now = new Date('2026-10-23T12:00:00Z');

export default function ActivityFeedRecent() {
  return (
    <ActivityFeed
      now={now}
      items={[
        {
          id: 1,
          time: '2026-10-23T10:12:00Z',
          title: 'Applied to Senior Engineer at Stripe',
          icon: <Send size={14} />,
        },
        {
          id: 2,
          time: '2026-10-23T08:40:00Z',
          title: 'Generated a cover letter',
          description: 'Staff Frontend Engineer, Vercel',
          icon: <FileText size={14} />,
        },
        {
          id: 3,
          time: '2026-10-21T16:00:00Z',
          title: 'Your resume was viewed 14 times',
          icon: <Eye size={14} />,
        },
      ]}
    />
  );
}
