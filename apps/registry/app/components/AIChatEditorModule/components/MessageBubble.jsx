import { Button } from '@repo/ui';

export const MessageBubble = ({
  message,
  speaking,
  onStopSpeaking,
  onApplyChanges,
}) => {
  const getMessageStyles = () => {
    if (message.role === 'user') {
      return 'bg-blue-500 text-white max-w-[80%]';
    }
    if (message.role === 'system') {
      if (message.type === 'error') return 'bg-red-100 text-red-700 w-full';
      if (message.type === 'success')
        return 'bg-green-100 text-green-700 w-full';
      return 'bg-gray-100 text-gray-700 w-full';
    }
    return 'bg-gray-100 text-gray-900 w-full';
  };

  const getAlignmentClass = () => {
    if (message.role === 'user') return 'justify-end';
    if (message.role === 'system') return 'justify-center';
    return 'justify-start';
  };

  return (
    <div className={`flex ${getAlignmentClass()} w-full`}>
      <div className={`${getMessageStyles()} p-3 rounded-lg`}>
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        {message.role === 'assistant' && speaking && (
          <Button
            onClick={onStopSpeaking}
            className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded flex items-center justify-center gap-2"
          >
            <span className="animate-pulse">●</span>
            Stop Speaking
          </Button>
        )}
        {message.role === 'assistant' && message.suggestedChanges && (
          <div className="mt-2 -mx-3">
            <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto my-2 text-sm w-full whitespace-pre-wrap break-words">
              {JSON.stringify(message.suggestedChanges, null, 2)}
            </pre>
            <Button
              onClick={() =>
                onApplyChanges(message.suggestedChanges, message.id)
              }
              disabled={message.changesApplied}
              className={`
                w-full text-center py-2 px-4 rounded
                ${
                  message.changesApplied
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }
              `}
            >
              {message.changesApplied ? '✓ Changes Applied' : 'Apply Changes'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
