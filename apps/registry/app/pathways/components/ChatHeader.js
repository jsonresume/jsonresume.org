'use client';

import { Volume2, VolumeX } from 'lucide-react';
import styles from './chat.module.css';

const VOICE_OPTIONS = [
  { value: 'alloy', label: 'Alloy' },
  { value: 'echo', label: 'Echo' },
  { value: 'fable', label: 'Fable' },
  { value: 'onyx', label: 'Onyx' },
  { value: 'nova', label: 'Nova' },
  { value: 'shimmer', label: 'Shimmer' },
];

export default function ChatHeader({
  isSpeechEnabled,
  isGeneratingSpeech,
  selectedVoice,
  onToggleSpeech,
  onVoiceChange,
}) {
  return (
    <div className={styles.header}>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className={styles.headerTitle}>Career Copilot</h2>
            <span className={styles.headerSubtitle}>AI Assistant</span>
          </div>
          <button
            onClick={onToggleSpeech}
            className={`${styles.voiceButton} ${
              isSpeechEnabled ? styles.voiceButtonActive : ''
            }`}
            title={isSpeechEnabled ? 'Disable voice' : 'Enable voice'}
          >
            {isSpeechEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            {isGeneratingSpeech && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            )}
          </button>
        </div>
        {isSpeechEnabled && (
          <select
            value={selectedVoice}
            onChange={(e) => onVoiceChange(e.target.value)}
            className={`${styles.voiceSelect} mt-2 w-full`}
          >
            {VOICE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
