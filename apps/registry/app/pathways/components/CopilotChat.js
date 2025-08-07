'use client';

import { Send } from 'lucide-react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useRef, useState } from 'react';
import Messages from './Messages';
import applyResumeChanges from '../utils/applyResumeChanges';

export default function CopilotChat({
  resumeData,
  setResumeData,
  setResumeJson,
}) {
  const handledToolCalls = useRef(new Set());
  const [input, setInput] = useState('');

  const { messages, sendMessage, status, addToolResult } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/pathways',
      body: { currentResume: resumeData },
    }),
    initialMessages: [
      {
        role: 'assistant',
        content:
          "Hi! I'm your Copilot. Ask me anything about your career pathway.",
        parts: [
          {
            type: 'text',
            text: "Hi! I'm your Copilot. Ask me anything about your career pathway.",
          },
        ],
      },
    ],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  const isLoading = status === 'streaming';

  // Apply resume updates returned by the AI tool
  useEffect(() => {
    for (const msg of messages) {
      for (const part of msg.parts ?? []) {
        if (
          part.type === 'tool-invocation' &&
          ['updateResume', 'update_resume'].includes(
            part.toolInvocation.toolName
          ) &&
          part.toolInvocation.state === 'call' &&
          !handledToolCalls.current.has(part.toolInvocation.toolCallId)
        ) {
          const { changes } = part.toolInvocation.input ?? {};
          if (changes && typeof changes === 'object') {
            setResumeData((prev) => applyResumeChanges(prev, changes));
            setResumeJson((prev) =>
              JSON.stringify(
                applyResumeChanges(JSON.parse(prev), changes),
                null,
                2
              )
            );
          }
          addToolResult({
            toolCallId: part.toolInvocation.toolCallId,
            output: 'Changes applied',
          });
          handledToolCalls.current.add(part.toolInvocation.toolCallId);
        }
      }
    }
  }, [messages, addToolResult, setResumeData, setResumeJson]);
  return (
    <aside className="w-[360px] border-l bg-white flex flex-col">
      <div className="px-4 py-3 border-b">
        <h2 className="text-base font-medium">Copilot Chat</h2>
      </div>
      <div className="flex-1 overflow-auto p-4 text-sm text-gray-500">
        <Messages messages={messages} isLoading={isLoading} />
      </div>
      <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="p-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </aside>
  );
}
