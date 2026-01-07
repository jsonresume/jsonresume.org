import { describe, it, expect } from 'vitest';
import { getAudioExtension } from './audioUtils';

describe('getAudioExtension', () => {
  it('returns wav for audio/wav mime type', () => {
    expect(getAudioExtension('audio/wav')).toBe('wav');
  });

  it('returns webm for audio/webm mime type', () => {
    expect(getAudioExtension('audio/webm')).toBe('webm');
  });

  it('returns ogg for audio/ogg mime type', () => {
    expect(getAudioExtension('audio/ogg')).toBe('ogg');
  });

  it('returns mp4 for audio/mp4 mime type', () => {
    expect(getAudioExtension('audio/mp4')).toBe('mp4');
  });

  it('returns wav as default for unknown mime types', () => {
    expect(getAudioExtension('audio/unknown')).toBe('wav');
  });

  it('returns wav for empty string', () => {
    expect(getAudioExtension('')).toBe('wav');
  });

  it('handles codec suffixes like audio/webm;codecs=opus', () => {
    expect(getAudioExtension('audio/webm;codecs=opus')).toBe('webm');
  });

  it('handles video mime types containing audio format', () => {
    expect(getAudioExtension('video/mp4')).toBe('mp4');
  });
});
