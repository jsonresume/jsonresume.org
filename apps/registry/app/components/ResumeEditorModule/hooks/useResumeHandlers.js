import { useState, useCallback, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { render } from '@jsonresume/jsonresume-theme-professional';
import { applyChanges } from '../utils/resumeMerge';

export const useResumeHandlers = (resume, setResume) => {
  const [content, setContent] = useState('');
  const [, setPendingChanges] = useState(null);

  useEffect(() => {
    logger.debug(
      { resumeKeys: Object.keys(resume || {}) },
      'Resume state updated'
    );
  }, [resume]);

  useEffect(() => {
    // Always use professional theme for editor preview
    try {
      const html = render(resume);
      setContent(html);
    } catch (error) {
      logger.error({ error: error.message }, 'Error rendering resume');
    }
  }, [resume]);

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
