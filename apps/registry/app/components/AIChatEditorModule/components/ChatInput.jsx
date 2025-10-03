import { Button } from '@repo/ui';
import { Send, Mic, MicOff, Settings } from 'lucide-react';

export const ChatInput = ({
  inputMessage,
  setInputMessage,
  onSubmit,
  isRecording,
  onStartRecording,
  onStopRecording,
  onToggleSettings,
  showSettings,
  isLoading,
}) => {
  return (
    <div className="p-4">
      <div className="flex space-x-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSubmit(inputMessage)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded"
        />
        <Button
          onClick={() => onSubmit(inputMessage)}
          disabled={isLoading || !inputMessage.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
        <Button
          onClick={isRecording ? onStopRecording : onStartRecording}
          disabled={isLoading}
          className={isRecording ? 'bg-red-500 hover:bg-red-600' : ''}
        >
          {isRecording ? (
            <MicOff className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </Button>
        <Button
          onClick={onToggleSettings}
          className={showSettings ? 'bg-blue-100' : ''}
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
