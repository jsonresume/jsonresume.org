export const sendChatMessage = async (messages, currentResume) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      currentResume,
    }),
  });

  if (!response.ok) throw new Error('Failed to get AI response');

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
};
