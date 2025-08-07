'use client';

import { Send, Mic, MicOff } from 'lucide-react';

export default function ChatInput({
  input,
  isRecording,
  isTranscribing,
  onInputChange,
  onSubmit,
  onToggleRecording,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isTranscribing) {
      onSubmit(input);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
      <button
        type="button"
        onClick={onToggleRecording}
        disabled={isTranscribing}
        className={`p-2 rounded-md transition-colors flex items-center justify-center relative ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
            : isTranscribing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
        }`}
        title={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
        {isTranscribing && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
        )}
      </button>
      <input
        type="text"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder={
          isTranscribing ? 'Transcribing...' : 'Type or speak a message...'
        }
        disabled={isTranscribing}
        className="flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
      />
      <button
        type="submit"
        disabled={isTranscribing || !input.trim()}
        className="p-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}
