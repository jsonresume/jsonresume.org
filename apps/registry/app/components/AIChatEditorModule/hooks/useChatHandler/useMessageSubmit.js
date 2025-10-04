import { useState, useCallback } from 'react';
import { sendChatMessage } from '../../utils/chatApi';

export const useMessageSubmit = ({
  resume,
  onResumeChange,
  addMessage,
  addSystemMessage,
  getRecentContext,
  settings,
  speak,
  handleApplyChanges,
}) => {
  const [isLoading, setIsLoading] = useState(false);

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

  return { isLoading, handleSubmitMessage };
};
