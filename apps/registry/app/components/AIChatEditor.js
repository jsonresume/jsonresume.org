import { useState } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useSettings } from '../hooks/useSettings';
import { useMessages } from './AIChatEditorModule/hooks/useMessages';
import { useRecording } from './AIChatEditorModule/hooks/useRecording';
import { useChatHandler } from './AIChatEditorModule/hooks/useChatHandler';
import { MessageList } from './AIChatEditorModule/components/MessageList';
import { ChatInput } from './AIChatEditorModule/components/ChatInput';
import { SettingsPanel } from './AIChatEditorModule/components/SettingsPanel';

const AIChatEditor = ({ resume, onResumeChange, onApplyChanges }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const { speak, stop, speaking } = useSpeech();
  const [settings, updateSettings] = useSettings();

  const {
    messages,
    addMessage,
    addSystemMessage,
    markChangesApplied,
    getRecentContext,
  } = useMessages();

  const { isLoading, handleSubmitMessage, handleApplyChanges } = useChatHandler(
    {
      resume,
      onResumeChange,
      onApplyChanges,
      addMessage,
      addSystemMessage,
      markChangesApplied,
      getRecentContext,
      settings,
      speak,
    }
  );

  const { isRecording, startRecording, stopRecording } = useRecording({
    onTranscribed: (text) => {
      handleSubmitMessage(text);
      setInputMessage('');
    },
    onError: (errorMessage) => {
      addSystemMessage(errorMessage, 'error');
    },
  });

  const handleSubmit = (message) => {
    if (message.trim()) {
      handleSubmitMessage(message);
      setInputMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <MessageList
        messages={messages}
        isLoading={isLoading}
        speaking={speaking}
        onStopSpeaking={stop}
        onApplyChanges={handleApplyChanges}
      />

      <div className="border-t">
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSubmit={handleSubmit}
          isRecording={isRecording}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onToggleSettings={() => setShowSettings(!showSettings)}
          showSettings={showSettings}
          isLoading={isLoading}
        />

        {showSettings && (
          <SettingsPanel settings={settings} updateSettings={updateSettings} />
        )}
      </div>
    </div>
  );
};

export default AIChatEditor;
