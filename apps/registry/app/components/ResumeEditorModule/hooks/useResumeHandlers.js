import { useState, useCallback, useEffect } from 'react';
import { logger } from '@/lib/logger';
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
    logger.debug(
      { resumeKeys: Object.keys(resume || {}) },
      'Resume state updated'
    );
  }, [resume]);

  useEffect(() => {
    // For professional theme, render locally for better performance
    if (selectedTheme === 'professional') {
      try {
        const html = render(resume);
        setContent(html);
      } catch (error) {
        logger.error(
          { error: error.message, theme: selectedTheme },
          'Error rendering resume'
        );
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
          logger.error(
            { error: error.message, theme: selectedTheme },
            'Error fetching theme HTML'
          );
          // Fallback to professional theme
          try {
            const html = render(resume);
            setContent(html);
          } catch (fallbackError) {
            logger.error(
              { error: fallbackError.message, theme: selectedTheme },
              'Fallback render also failed'
            );
          }
        }
      };
      fetchThemeHtml();
    }
  }, [resume, selectedTheme]);

  const handleResumeChange = useCallback((changes) => {
    logger.debug(
      { changesCount: changes ? Object.keys(changes).length : 0 },
      'Received changes in ResumeEditor'
    );
    if (!changes) {
      logger.warn('No changes received');
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
      logger.debug(
        { changesKeys: Object.keys(changes || {}) },
        'GUI editor changes'
      );
      setResume((prev) => ({ ...prev, ...changes }));
    },
    [setResume]
  );

  const handleJsonChange = useCallback(
    (newResume) => {
      logger.debug(
        { isString: typeof newResume === 'string' },
        'Received JSON changes'
      );
      try {
        setResume(
          typeof newResume === 'string' ? JSON.parse(newResume) : newResume
        );
      } catch (error) {
        logger.error({ error: error.message }, 'Error parsing JSON');
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
