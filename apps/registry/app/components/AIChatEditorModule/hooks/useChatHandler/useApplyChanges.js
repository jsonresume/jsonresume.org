import { useCallback } from 'react';

export const useApplyChanges = ({
  onApplyChanges,
  addSystemMessage,
  markChangesApplied,
}) => {
  const handleApplyChanges = useCallback(
    (changes, messageId) => {
      console.log('Applying changes...', changes);
      if (!changes) {
        console.log('No changes to apply');
        return;
      }

      if (onApplyChanges) {
        try {
          onApplyChanges(changes);
          console.log('Changes applied successfully');
          addSystemMessage(
            '✅ Changes have been successfully applied to your resume',
            'success'
          );
          markChangesApplied(messageId);
        } catch (error) {
          console.error('Error applying changes:', error);
          addSystemMessage(
            '❌ Failed to apply changes: ' + error.message,
            'error'
          );
        }
      } else {
        console.warn('onApplyChanges callback is not defined');
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
