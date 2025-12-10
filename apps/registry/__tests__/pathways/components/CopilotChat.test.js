import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock the AI SDK React hook
const mockSendMessage = jest.fn();
const mockAddToolResult = jest.fn();
const mockUseChat = {
  messages: [
    {
      role: 'assistant',
      content:
        "Hi! I'm your Copilot. Ask me anything about your career pathway.",
    },
  ],
  sendMessage: mockSendMessage,
  status: 'idle',
  addToolResult: mockAddToolResult,
};

jest.mock('@ai-sdk/react', () => ({
  useChat: jest.fn(() => mockUseChat),
}));

// Mock Messages component
jest.mock('../../../app/pathways/components/Messages', () => {
  return function MockMessages({ messages }) {
    return (
      <div data-testid="messages">
        {messages.map((msg, idx) => (
          <div key={idx}>{msg.content}</div>
        ))}
      </div>
    );
  };
});

// Mock applyResumeChanges utility
jest.mock('../../../app/pathways/utils/applyResumeChanges', () => {
  return jest.fn((prev, changes) => ({ ...prev, ...changes }));
});

import CopilotChat from '../../../app/pathways/components/CopilotChat';

describe('CopilotChat Component (Simplified)', () => {
  const defaultProps = {
    resumeData: { basics: { name: 'John Doe' } },
    setResumeData: jest.fn(),
    setResumeJson: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
  });

  describe('basic rendering', () => {
    it('should render the chat interface', () => {
      render(<CopilotChat {...defaultProps} />);

      expect(screen.getByText('Copilot Chat')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Type or speak a message...')
      ).toBeInTheDocument();
      expect(screen.getByTestId('messages')).toBeInTheDocument();
    });

    it('should render initial assistant message', () => {
      render(<CopilotChat {...defaultProps} />);

      expect(
        screen.getByText(
          "Hi! I'm your Copilot. Ask me anything about your career pathway."
        )
      ).toBeInTheDocument();
    });
  });

  describe('message sending', () => {
    it('should send message on form submit', async () => {
      render(<CopilotChat {...defaultProps} />);

      const input = screen.getByPlaceholderText('Type or speak a message...');

      await userEvent.type(input, 'Help me improve my resume');
      await userEvent.keyboard('{Enter}');

      expect(mockSendMessage).toHaveBeenCalledWith({
        text: 'Help me improve my resume',
      });
    });

    it('should not send empty messages', async () => {
      render(<CopilotChat {...defaultProps} />);

      const input = screen.getByPlaceholderText('Type or speak a message...');

      await userEvent.type(input, '   ');
      await userEvent.keyboard('{Enter}');

      expect(mockSendMessage).not.toHaveBeenCalled();
    });
  });

  describe('voice controls', () => {
    it('should render voice toggle button', () => {
      render(<CopilotChat {...defaultProps} />);

      expect(screen.getByTitle('Enable voice')).toBeInTheDocument();
    });

    it('should render microphone button', () => {
      render(<CopilotChat {...defaultProps} />);

      expect(screen.getByTitle('Start recording')).toBeInTheDocument();
    });
  });
});
