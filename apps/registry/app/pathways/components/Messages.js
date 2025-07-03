import Message from './Message';

export default function Messages({ messages, isLoading }) {
  return (
    <div className="space-y-3">
      {messages?.map((m) => (
        <Message key={m.id} message={m} />
      ))}
      {isLoading && <p className="text-sm text-gray-500">Copilot is thinking…</p>}
    </div>
  );
}
