import { useCallback } from 'react';
import { logger } from '@/lib/logger';

export const useApplyChanges = ({
  onApplyChanges,
  addSystemMessage,
  markChangesApplied,
}) => {
  const handleApplyChanges = useCallback(
    (changes, messageId) => {
      logger.debug(
        { changesCount: changes ? Object.keys(changes).length : 0, messageId },
        'Applying changes'
      );
      if (!changes) {
        logger.debug('No changes to apply');
        return;
      }

      if (onApplyChanges) {
        try {
          onApplyChanges(changes);
          logger.info({ messageId }, 'Changes applied successfully');
          addSystemMessage(
            '✅ Changes have been successfully applied to your resume',
            'success'
          );
          markChangesApplied(messageId);
        } catch (error) {
          logger.error(
            { error: error.message, messageId },
            'Error applying changes'
          );
          addSystemMessage(
            '❌ Failed to apply changes: ' + error.message,
            'error'
          );
        }
      } else {
        logger.warn({ messageId }, 'onApplyChanges callback is not defined');
        addSystemMessage(
          '❌ Unable to apply changes: System not configured properly',
          'error'
        );
      }
    },
    [onApplyChanges, addSystemMessage, markChangesApplied]
  );

  return handleApplyChanges;
};
