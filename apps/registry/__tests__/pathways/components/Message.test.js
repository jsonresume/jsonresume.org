import React from 'react';
import { render, screen } from '@testing-library/react';
import Message from '../../../app/pathways/components/Message';

// Mock Part component
jest.mock('../../../app/pathways/components/Part', () => {
  return function MockPart({ part }) {
    return (
      <div data-testid={`part-${part.type}`}>{part.text || part.type}</div>
    );
  };
});

describe('Message Component', () => {
  describe('content rendering', () => {
    it('should render message content as string', () => {
      const message = {
        role: 'user',
        content: 'Hello, can you help me with my resume?',
      };

      render(<Message message={message} />);

      expect(screen.getByText('user:')).toBeInTheDocument();
      expect(
        screen.getByText('Hello, can you help me with my resume?')
      ).toBeInTheDocument();
    });

    it('should render empty content gracefully', () => {
      const message = {
        role: 'assistant',
        content: '',
      };

      render(<Message message={message} />);

      expect(screen.getByText('assistant:')).toBeInTheDocument();
      // Should not crash, though content is empty
    });

    it('should capitalize role names', () => {
      const message = {
        role: 'system',
        content: 'System message',
      };

      render(<Message message={message} />);

      expect(screen.getByText('system:')).toBeInTheDocument();
      // Role should be capitalized via CSS
      expect(screen.getByText('system:')).toHaveClass('capitalize');
    });
  });

  describe('parts rendering', () => {
    it('should render message parts when no content string', () => {
      const message = {
        role: 'assistant',
        parts: [
          { type: 'text', text: 'I can help you with your resume.' },
          {
            type: 'tool-updateResume',
            input: { explanation: 'Adding new skill' },
          },
        ],
      };

      render(<Message message={message} />);

      expect(screen.getByText('assistant:')).toBeInTheDocument();
      expect(screen.getByTestId('part-text')).toBeInTheDocument();
      expect(screen.getByTestId('part-tool-updateResume')).toBeInTheDocument();
    });

    it('should render multiple parts correctly', () => {
      const message = {
        role: 'assistant',
        parts: [
          { type: 'text', text: 'First part' },
          { type: 'text', text: 'Second part' },
          { type: 'tool-updateResume', input: { explanation: 'Tool part' } },
        ],
      };

      render(<Message message={message} />);

      const textParts = screen.getAllByTestId('part-text');
      expect(textParts).toHaveLength(2);
      expect(screen.getByTestId('part-tool-updateResume')).toBeInTheDocument();
    });

    it('should render empty parts array gracefully', () => {
      const message = {
        role: 'assistant',
        parts: [],
      };

      render(<Message message={message} />);

      expect(screen.getByText('assistant:')).toBeInTheDocument();
      // Should not crash with empty parts
    });

    it('should handle undefined parts gracefully', () => {
      const message = {
        role: 'assistant',
        parts: undefined,
      };

      render(<Message message={message} />);

      expect(screen.getByText('assistant:')).toBeInTheDocument();
      // Should not crash with undefined parts
    });
  });

  describe('fallback behavior', () => {
    it('should render nothing when no content or parts', () => {
      const message = {
        role: 'assistant',
      };

      render(<Message message={message} />);

      expect(screen.getByText('assistant:')).toBeInTheDocument();
      // Content area should be present but empty
    });

    it('should prefer content over parts when both exist', () => {
      const message = {
        role: 'assistant',
        content: 'String content',
        parts: [{ type: 'text', text: 'Parts content' }],
      };

      render(<Message message={message} />);

      expect(screen.getByText('String content')).toBeInTheDocument();
      expect(screen.queryByTestId('part-text')).not.toBeInTheDocument();
    });

    it('should handle non-array parts gracefully', () => {
      const message = {
        role: 'assistant',
        parts: 'not an array',
      };

      render(<Message message={message} />);

      expect(screen.getByText('assistant:')).toBeInTheDocument();
      // Should not crash with invalid parts type
    });
  });

  describe('styling and structure', () => {
    it('should apply correct CSS classes', () => {
      const message = {
        role: 'user',
        content: 'Test message',
      };

      render(<Message message={message} />);

      const container = screen.getByText('Test message').closest('div');
      expect(container).toHaveClass('space-y-1');

      const roleElement = screen.getByText('user:');
      expect(roleElement).toHaveClass('capitalize', 'text-xs');
    });

    it('should maintain proper DOM structure', () => {
      const message = {
        role: 'assistant',
        content: 'Test content',
      };

      render(<Message message={message} />);

      const container = screen.getByText('Test content').closest('div');
      expect(container).toBeInTheDocument();

      const strongElement = screen.getByText('assistant:');
      expect(strongElement.tagName).toBe('STRONG');
    });
  });

  describe('different role types', () => {
    const roleTypes = ['user', 'assistant', 'system', 'tool'];

    roleTypes.forEach((role) => {
      it(`should handle ${role} role correctly`, () => {
        const message = {
          role: role,
          content: `This is a ${role} message`,
        };

        render(<Message message={message} />);

        expect(screen.getByText(`${role}:`)).toBeInTheDocument();
        expect(
          screen.getByText(`This is a ${role} message`)
        ).toBeInTheDocument();
      });
    });
  });

  describe('special characters and formatting', () => {
    it('should handle special characters in content', () => {
      const message = {
        role: 'user',
        content: 'Message with special chars: <>&"\' and emojis 🚀📝',
      };

      render(<Message message={message} />);

      expect(
        screen.getByText('Message with special chars: <>&"\' and emojis 🚀📝')
      ).toBeInTheDocument();
    });

    it('should handle multiline content', () => {
      const message = {
        role: 'assistant',
        content: 'Line 1\nLine 2\nLine 3',
      };

      render(<Message message={message} />);

      // getByText normalizes whitespace, so we need to check for the content differently
      expect(screen.getByText('assistant:')).toBeInTheDocument();
      const contentElement = screen.getByText(
        (content, element) => element.textContent === 'Line 1\nLine 2\nLine 3'
      );
      expect(contentElement).toBeInTheDocument();
    });

    it('should handle very long content', () => {
      const longContent = 'A'.repeat(1000);
      const message = {
        role: 'user',
        content: longContent,
      };

      render(<Message message={message} />);

      expect(screen.getByText(longContent)).toBeInTheDocument();
    });
  });
});
