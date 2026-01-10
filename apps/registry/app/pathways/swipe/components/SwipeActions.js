'use client';

import { X, Heart, RotateCcw } from 'lucide-react';

export default function SwipeActions({
  onPass,
  onLike,
  onUndo,
  canUndo,
  disabled,
}) {
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4 safe-area-bottom">
      <div className="flex items-center justify-center gap-6 max-w-md mx-auto">
        {/* Undo button */}
        <button
          onClick={onUndo}
          disabled={!canUndo || disabled}
          className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-gray-300 text-gray-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:border-yellow-500 hover:text-yellow-500 hover:bg-yellow-50"
          title="Undo"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Pass button */}
        <button
          onClick={onPass}
          disabled={disabled}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-red-50 border-2 border-red-400 text-red-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-100 hover:border-red-500 hover:scale-105 active:scale-95"
          title="Pass"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Like button */}
        <button
          onClick={onLike}
          disabled={disabled}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-green-50 border-2 border-green-400 text-green-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-green-100 hover:border-green-500 hover:scale-105 active:scale-95"
          title="Interested"
        >
          <Heart className="w-8 h-8" />
        </button>

        {/* Spacer to balance the layout */}
        <div className="w-12 h-12" />
      </div>
    </div>
  );
}
