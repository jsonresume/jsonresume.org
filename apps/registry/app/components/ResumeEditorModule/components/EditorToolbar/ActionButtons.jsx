import Link from 'next/link';
import { Button } from '@repo/ui';
import { ExternalLink, Save } from 'lucide-react';

export const ActionButtons = ({ username, onSave, isSaving, hasChanges }) => {
  return (
    <div className="flex items-center gap-3 shrink-0">
      <Button
        variant="outline"
        size="sm"
        asChild
        className="transition-colors hover:bg-gray-50"
      >
        <Link
          href={`/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
          <span>View Public</span>
        </Link>
      </Button>
      <Button
        size="sm"
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={onSave}
        disabled={isSaving || !hasChanges}
      >
        <Save className="w-4 h-4" aria-hidden="true" />
        <span>{isSaving ? 'Saving...' : 'Save'}</span>
      </Button>
    </div>
  );
};
