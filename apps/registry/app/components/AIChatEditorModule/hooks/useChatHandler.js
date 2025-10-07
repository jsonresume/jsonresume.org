import { useApplyChanges, useMessageSubmit } from './useChatHandler';

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
  const handleApplyChanges = useApplyChanges({
    onApplyChanges,
    addSystemMessage,
    markChangesApplied,
  });

  const { isLoading, handleSubmitMessage } = useMessageSubmit({
    resume,
    onResumeChange,
    addMessage,
    addSystemMessage,
    getRecentContext,
    settings,
    speak,
    handleApplyChanges,
  });

  return {
    isLoading,
    handleSubmitMessage,
    handleApplyChanges,
  };
};
