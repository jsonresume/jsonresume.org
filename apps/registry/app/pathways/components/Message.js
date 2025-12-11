import Part from './Part';
import styles from './chat.module.css';

export default function Message({ message }) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

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
    <div
      className={`${styles.message} ${isUser ? styles.messageUser : ''} ${
        isAssistant ? styles.messageAssistant : ''
      }`}
    >
      <div className={styles.messageRole}>
        <span
          className={`${styles.roleIndicator} ${
            isUser ? styles.roleIndicatorUser : styles.roleIndicatorAssistant
          }`}
        />
        <span className={isUser ? styles.roleUser : styles.roleAssistant}>
          {isUser ? 'You' : 'Copilot'}
        </span>
      </div>
      <div className={styles.messageContent}>{renderContent()}</div>
    </div>
  );
}
