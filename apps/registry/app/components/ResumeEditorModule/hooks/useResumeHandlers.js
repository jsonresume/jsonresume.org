import { useState, useCallback, useEffect } from 'react';
import { render } from '../../../../../../packages/jsonresume-theme-professional';
import { applyChanges } from '../utils/resumeMerge';

export const useResumeHandlers = (
  resume,
  setResume,
  selectedTheme = 'professional'
) => {
  const [content, setContent] = useState('');
  const [, setPendingChanges] = useState(null);

  useEffect(() => {
    console.log('Current resume state:', resume);
  }, [resume]);

  useEffect(() => {
    // For professional theme, render locally for better performance
    if (selectedTheme === 'professional') {
      try {
        const html = render(resume);
        setContent(html);
      } catch (error) {
        console.error('Error rendering resume:', error);
      }
    } else {
      // For other themes, fetch from API to avoid bundling issues
      const fetchThemeHtml = async () => {
        try {
          const resumeData = encodeURIComponent(JSON.stringify(resume));
          const response = await fetch(
            `/api/theme/${selectedTheme}?resume=${resumeData}`
          );
          if (response.ok) {
            const html = await response.text();
            setContent(html);
          } else {
            // Fallback to professional theme
            const html = render(resume);
            setContent(html);
          }
        } catch (error) {
          console.error('Error fetching theme HTML:', error);
          // Fallback to professional theme
          try {
            const html = render(resume);
            setContent(html);
          } catch (fallbackError) {
            console.error('Fallback render also failed:', fallbackError);
          }
        }
      };
      fetchThemeHtml();
    }
  }, [resume, selectedTheme]);

  const handleResumeChange = useCallback((changes) => {
    console.log('Received changes in ResumeEditor:', changes);
    if (!changes) {
      console.warn('No changes received');
      return;
    }
    setPendingChanges(changes);
  }, []);

  const handleApplyChanges = useCallback(
    (changes) => {
      const newResume = applyChanges(resume, changes);
      setResume(newResume);
    },
    [resume, setResume]
  );

  const handleGuiChange = useCallback(
    (changes) => {
      console.log('GUI editor changes:', changes);
      setResume((prev) => ({ ...prev, ...changes }));
    },
    [setResume]
  );

  const handleJsonChange = useCallback(
    (newResume) => {
      console.log('Received JSON changes:', newResume);
      try {
        setResume(
          typeof newResume === 'string' ? JSON.parse(newResume) : newResume
        );
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    },
    [setResume]
  );

  return {
    content,
    handleResumeChange,
    handleApplyChanges,
    handleGuiChange,
    handleJsonChange,
  };
};
