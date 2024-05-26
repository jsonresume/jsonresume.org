'use client';

import { useEffect } from 'react';
import { useRecordVoice } from './useRecordVoice';

const RecordButton = ({ onNewText }) => {
  const { text, recording, startRecording, stopRecording } = useRecordVoice();

  useEffect(() => {
    onNewText(text);
  }, [text]);

  return (
    // Button for starting and stopping voice recording
    <button
      onMouseDown={startRecording} // Start recording when mouse is pressed
      onMouseUp={stopRecording} // Stop recording when mouse is released
      onTouchStart={startRecording} // Start recording when touch begins on a touch device
      onTouchEnd={stopRecording} // Stop recording when touch ends on a touch device
      className="border-none bg-transparent w-10"
    >
      {/* Microphone icon component */}
      {recording ? 'mic ON' : 'mic OFF'}
      <p>{text}</p>
    </button>
  );
};

export default RecordButton;
