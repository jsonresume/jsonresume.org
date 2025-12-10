import Part from './Part';

export default function Message({ message }) {
  // Handle both content string and parts array
  const renderContent = () => {
    if (message.content) {
      return <span>{message.content}</span>;
    }
    if (message.parts && Array.isArray(message.parts)) {
      return message.parts.map((part, idx) => <Part key={idx} part={part} />);
    }
    return null;
  };

  return (
    <div className="space-y-1">
      <strong className="capitalize text-xs">{`${message.role}: `}</strong>
      {renderContent()}
    </div>
  );
}
