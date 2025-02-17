import { useState, useEffect } from 'react';

export function useSettings() {
  const [settings, setSettings] = useState({
    ttsEnabled: true, // Text-to-speech enabled by default
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('resume-ai-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings:', error);
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
