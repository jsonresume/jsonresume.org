'use client';

import { Send, Mic, MicOff, Paperclip } from 'lucide-react';
import { useState } from 'react';
import FileUpload from './FileUpload';

export default function ChatInput({
  input,
  isRecording,
  isTranscribing,
  onInputChange,
  onSubmit,
  onToggleRecording,
  onFileUpload,
}) {
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isTranscribing) {
      onSubmit(input);
    }
  };

  const handleFileUpload = async (files) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));

      const response = await fetch('/api/pathways/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      // Close upload UI and notify parent
      setShowFileUpload(false);
      if (onFileUpload) {
        onFileUpload(result.extractedData);
      }
    } catch (error) {
      console.error('File upload error:', error);
      throw error; // Re-throw to show in FileUpload component
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border-t">
      {/* File Upload Area */}
      {showFileUpload && (
        <div className="p-3 border-b bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">Upload Resume</h4>
            <button
              onClick={() => setShowFileUpload(false)}
              className="text-gray-400 hover:text-gray-600"
              disabled={isUploading}
            >
              ×
            </button>
          </div>
          <FileUpload
            onFileUpload={handleFileUpload}
            isUploading={isUploading}
          />
        </div>
      )}

      {/* Chat Input Form */}
      <form onSubmit={handleSubmit} className="p-3 flex gap-2">
        <button
          type="button"
          onClick={() => setShowFileUpload(!showFileUpload)}
          disabled={isTranscribing || isUploading}
          className={`p-2 rounded-md transition-colors flex items-center justify-center ${
            showFileUpload
              ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          } ${
            isTranscribing || isUploading ? 'cursor-not-allowed opacity-50' : ''
          }`}
          title="Upload resume file"
        >
          <Paperclip className="w-4 h-4" />
        </button>
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
    </div>
  );
}
