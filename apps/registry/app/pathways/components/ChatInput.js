'use client';

import { Send, Mic, MicOff, Paperclip, X } from 'lucide-react';
import { useState } from 'react';
import FileUpload from './FileUpload';
import styles from './chat.module.css';

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

      setShowFileUpload(false);
      if (onFileUpload) {
        onFileUpload(result.extractedData);
      }
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.inputContainer}>
      {/* File Upload Area */}
      {showFileUpload && (
        <div className={styles.uploadArea}>
          <div className={styles.uploadHeader}>
            <h4 className={styles.uploadTitle}>Upload Resume</h4>
            <button
              onClick={() => setShowFileUpload(false)}
              className={styles.uploadClose}
              disabled={isUploading}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <FileUpload
            onFileUpload={handleFileUpload}
            isUploading={isUploading}
          />
        </div>
      )}

      {/* Chat Input Form */}
      <form onSubmit={handleSubmit} className={styles.inputWrapper}>
        <button
          type="button"
          onClick={() => setShowFileUpload(!showFileUpload)}
          disabled={isTranscribing || isUploading}
          className={styles.inputButton}
          title="Upload resume file"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onToggleRecording}
          disabled={isTranscribing}
          className={`${styles.inputButton} ${
            isRecording ? styles.inputButtonActive : ''
          }`}
          title={isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isRecording ? (
            <MicOff className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={isTranscribing ? 'Transcribing...' : 'Ask anything...'}
          disabled={isTranscribing}
          className={styles.inputField}
        />

        <button
          type="submit"
          disabled={isTranscribing || !input.trim()}
          className={`${styles.inputButton} ${styles.inputButtonPrimary}`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
