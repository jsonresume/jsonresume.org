// Audio utilities for voice recording

/**
 * Convert audio blob to WAV format for better transcription compatibility
 */
export async function convertToWav(audioBlob) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Create WAV file
  const length = audioBuffer.length * audioBuffer.numberOfChannels * 2;
  const buffer = new ArrayBuffer(44 + length);
  const view = new DataView(buffer);

  // Write WAV header
  writeWavHeader(view, audioBuffer, length);

  // Convert audio data
  const channelData = audioBuffer.getChannelData(0);
  let offset = 44;
  for (let i = 0; i < channelData.length; i++) {
    const sample = Math.max(-1, Math.min(1, channelData[i]));
    view.setInt16(offset, sample * 0x7fff, true);
    offset += 2;
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

function writeWavHeader(view, audioBuffer, dataLength) {
  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, audioBuffer.numberOfChannels, true);
  view.setUint32(24, audioBuffer.sampleRate, true);
  view.setUint32(
    28,
    audioBuffer.sampleRate * 2 * audioBuffer.numberOfChannels,
    true
  );
  view.setUint16(32, audioBuffer.numberOfChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, dataLength, true);
}

/**
 * Get file extension based on MIME type
 */
export function getAudioExtension(mimeType) {
  if (mimeType.includes('wav')) return 'wav';
  if (mimeType.includes('webm')) return 'webm';
  if (mimeType.includes('ogg')) return 'ogg';
  if (mimeType.includes('mp4')) return 'mp4';
  return 'wav';
}
