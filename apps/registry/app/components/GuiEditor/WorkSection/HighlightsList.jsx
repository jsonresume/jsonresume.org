'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button, Input } from '@repo/ui';

export const HighlightsList = ({
  highlights,
  workIndex,
  addHighlight,
  updateHighlight,
  removeHighlight,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Highlights
      </label>
      {(highlights || []).map((highlight, hIndex) => (
        <div key={hIndex} className="flex gap-2">
          <Input
            type="text"
            value={highlight}
            onChange={(e) => updateHighlight(workIndex, hIndex, e.target.value)}
            className="flex-1"
            placeholder="Achievement or responsibility..."
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => removeHighlight(workIndex, hIndex)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => addHighlight(workIndex)}
        className="w-full flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Highlight
      </Button>
    </div>
  );
};
