import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

export function useSettings() {
  const [settings, setSettings] = useState({
    ttsEnabled: true, // Text-to-speech enabled by default
    autoApplyChanges: false, // Auto-apply changes disabled by default
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('resume-ai-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        logger.error({ error: error.message }, 'Error loading settings');
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  const updateSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('resume-ai-settings', JSON.stringify(updatedSettings));
  };

  return [settings, updateSettings];
}
