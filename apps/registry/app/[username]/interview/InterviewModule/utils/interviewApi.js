export async function streamInterviewResponse(
  username,
  prompt,
  position,
  recentMessages,
  onChunk
) {
  const response = await fetch('/api/interview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      prompt,
      position,
      messages: recentMessages,
    }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = response.body;
  if (!data) {
    return '';
  }

  const reader = data.getReader();
  const decoder = new TextDecoder();
  let done = false;
  let fullReply = '';

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunkValue = decoder.decode(value);
    fullReply = fullReply + chunkValue;
    onChunk(fullReply);
  }

  return fullReply;
}
