'use client';

import Messages from './Messages';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import ResumeParseResult from './ResumeParseResult';
import AgentStatus from './AgentStatus';
import { useCopilotChatState } from '../hooks/useCopilotChatState';

export default function CopilotChat({
  resumeData,
  setResumeData,
  setResumeJson,
}) {
  const {
    // Input state
    input,
    setInput,
    allMessages,

    // Loading states
    isLoadingConversation,
    isLoadingMore,
    isSaving,
    hasMore,
    status,

    // Speech state
    isSpeechEnabled,
    isGeneratingSpeech,
    selectedVoice,
    setSelectedVoice,
    toggleSpeech,

    // Recording state
    isRecording,
    isTranscribing,

    // File upload state
    pendingResumeData,
    isApplyingResume,

    // Handlers
    handleSubmit,
    handleToggleRecording,
    handleLoadMore,
    handleFileUpload,
    handleApplyResumeData,
    handleDismissParseResult,
    clearConversation,
  } = useCopilotChatState({ resumeData, setResumeData });

  if (isLoadingConversation) {
    return (
      <aside className="w-[360px] border-l bg-white flex flex-col items-center justify-center">
        <div className="animate-pulse text-gray-400">
          Loading conversation...
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-[360px] border-l bg-white flex flex-col">
      <ChatHeader
        isSpeechEnabled={isSpeechEnabled}
        isGeneratingSpeech={isGeneratingSpeech}
        selectedVoice={selectedVoice}
        onToggleSpeech={toggleSpeech}
        onVoiceChange={setSelectedVoice}
        isSaving={isSaving}
        onClearConversation={clearConversation}
      />

      <div className="flex-1 overflow-hidden p-4 text-sm text-gray-500">
        <Messages
          messages={allMessages}
          isLoading={status === 'streaming'}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
        />

        {pendingResumeData && (
          <ResumeParseResult
            parsedData={pendingResumeData.data}
            onApplyChanges={handleApplyResumeData}
            onDismiss={handleDismissParseResult}
            isApplying={isApplyingResume}
          />
        )}
      </div>

      {/* Agent processing status */}
      <div className="px-4">
        <AgentStatus status={status} />
      </div>

      <ChatInput
        input={input}
        isRecording={isRecording}
        isTranscribing={isTranscribing}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        onToggleRecording={handleToggleRecording}
        onFileUpload={handleFileUpload}
      />
    </aside>
  );
}
