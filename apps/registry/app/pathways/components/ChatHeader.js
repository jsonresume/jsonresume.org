'use client';

import { Volume2, VolumeX } from 'lucide-react';

const VOICE_OPTIONS = [
  { value: 'alloy', label: 'Alloy (Neutral)' },
  { value: 'echo', label: 'Echo (Male)' },
  { value: 'fable', label: 'Fable (British)' },
  { value: 'onyx', label: 'Onyx (Deep)' },
  { value: 'nova', label: 'Nova (Friendly)' },
  { value: 'shimmer', label: 'Shimmer (Female)' },
];

export default function ChatHeader({
  isSpeechEnabled,
  isGeneratingSpeech,
  selectedVoice,
  onToggleSpeech,
  onVoiceChange,
}) {
  return (
    <div className="px-4 py-3 border-b">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-medium">Copilot Chat</h2>
        <button
          onClick={onToggleSpeech}
          className={`p-2 rounded-md transition-colors relative ${
            isSpeechEnabled
              ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title={isSpeechEnabled ? 'Disable voice' : 'Enable voice'}
        >
          {isSpeechEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
          {isGeneratingSpeech && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
          )}
        </button>
      </div>
      {isSpeechEnabled && (
        <select
          value={selectedVoice}
          onChange={(e) => onVoiceChange(e.target.value)}
          className="text-xs px-2 py-1 border rounded-md w-full"
        >
          {VOICE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
