import { useState, useCallback } from 'react';
import { sendChatMessage } from '../utils/chatApi';

export const useChatHandler = ({
  resume,
  onResumeChange,
  onApplyChanges,
  addMessage,
  addSystemMessage,
  markChangesApplied,
  getRecentContext,
  settings,
  speak,
}) => {
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmitMessage = useCallback(
    async (message) => {
      try {
        setIsLoading(true);
        const newUserMessage = {
          role: 'user',
          content: message,
          id: Date.now(),
        };

        addMessage(newUserMessage);

        const recentMessages = getRecentContext(newUserMessage);
        const data = await sendChatMessage(recentMessages, resume);

        const assistantMessage = {
          role: 'assistant',
          content: data.message,
          id: Date.now(),
          suggestedChanges: data.suggestedChanges,
        };

        addMessage(assistantMessage);

        if (data.suggestedChanges) {
          console.log('Received suggested changes:', data.suggestedChanges);
          onResumeChange(data.suggestedChanges);

          if (settings.autoApplyChanges) {
            handleApplyChanges(data.suggestedChanges, assistantMessage.id);
            assistantMessage.changesApplied = true;
          }
        }

        if (settings.ttsEnabled) {
          try {
            await speak(data.message);
          } catch (err) {
            console.error('Error during speech:', err);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        addSystemMessage(error.message || 'Failed to process message', 'error');
      } finally {
        setIsLoading(false);
      }
    },
    [
      resume,
      onResumeChange,
      addMessage,
      addSystemMessage,
      getRecentContext,
      settings,
      speak,
      handleApplyChanges,
    ]
  );

  return {
    isLoading,
    handleSubmitMessage,
    handleApplyChanges,
  };
};
