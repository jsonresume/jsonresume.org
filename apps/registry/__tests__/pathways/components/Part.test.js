import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Part from '../../../app/pathways/components/Part';

describe('Part Component', () => {
  describe('text parts', () => {
    it('should render text part content', () => {
      const part = {
        type: 'text',
        text: 'This is a text message from the assistant.',
      };

      render(<Part part={part} />);

      expect(
        screen.getByText('This is a text message from the assistant.')
      ).toBeInTheDocument();
    });

    it('should handle empty text content', () => {
      const part = {
        type: 'text',
        text: '',
      };

      render(<Part part={part} />);

      expect(screen.getByText('')).toBeInTheDocument();
    });

    it('should handle undefined text content', () => {
      const part = {
        type: 'text',
        text: undefined,
      };

      render(<Part part={part} />);

      // Should render span but with undefined content
      const element = screen.getByText('');
      expect(element).toBeInTheDocument();
    });

    it('should handle special characters and formatting', () => {
      const part = {
        type: 'text',
        text: 'Text with <special> characters & symbols 🚀',
      };

      render(<Part part={part} />);

      expect(
        screen.getByText('Text with <special> characters & symbols 🚀')
      ).toBeInTheDocument();
    });
  });

  describe('tool-updateResume parts', () => {
    describe('with input-available state', () => {
      it('should render resume update with explanation', () => {
        const part = {
          type: 'tool-updateResume',
          state: 'input-available',
          input: {
            explanation:
              "I'm adding your new software engineering role at TechCorp.",
            changes: {
              work: [
                {
                  name: 'TechCorp',
                  position: 'Software Engineer',
                  startDate: '2024-01-01',
                },
              ],
            },
          },
        };

        render(<Part part={part} />);

        expect(screen.getByText('📝 Updating resume...')).toBeInTheDocument();
        expect(
          screen.getByText(
            "I'm adding your new software engineering role at TechCorp."
          )
        ).toBeInTheDocument();
        expect(screen.getByText('View changes')).toBeInTheDocument();
      });

      it('should render without explanation if not provided', () => {
        const part = {
          type: 'tool-updateResume',
          state: 'input-available',
          input: {
            changes: {
              basics: { name: 'John Doe' },
            },
          },
        };

        render(<Part part={part} />);

        expect(screen.getByText('📝 Updating resume...')).toBeInTheDocument();
        expect(screen.getByText('View changes')).toBeInTheDocument();
        // Should not have explanation section
        expect(screen.queryByText("I'm adding")).not.toBeInTheDocument();
      });

      it('should show changes in collapsible details', async () => {
        const part = {
          type: 'tool-updateResume',
          state: 'input-available',
          input: {
            explanation: 'Adding new skill',
            changes: {
              skills: [
                {
                  name: 'React',
                  level: 'Expert',
                },
              ],
            },
          },
        };

        render(<Part part={part} />);

        const detailsElement = screen.getByText('View changes');
        expect(detailsElement).toBeInTheDocument();

        // Click to expand details
        await userEvent.click(detailsElement);

        // Changes should be visible as formatted JSON
        expect(screen.getByText(/"skills"/)).toBeInTheDocument();
        expect(screen.getByText(/"React"/)).toBeInTheDocument();
        expect(screen.getByText(/"Expert"/)).toBeInTheDocument();
      });

      it('should handle missing input gracefully', () => {
        const part = {
          type: 'tool-updateResume',
          state: 'input-available',
          input: undefined,
        };

        render(<Part part={part} />);

        expect(screen.getByText('📝 Updating resume...')).toBeInTheDocument();
        // Should not crash without input
      });

      it('should handle missing changes in input', () => {
        const part = {
          type: 'tool-updateResume',
          state: 'input-available',
          input: {
            explanation: 'Update explanation',
            // no changes property
          },
        };

        render(<Part part={part} />);

        expect(screen.getByText('📝 Updating resume...')).toBeInTheDocument();
        expect(screen.getByText('Update explanation')).toBeInTheDocument();
        // Should not show "View changes" if no changes
        expect(screen.queryByText('View changes')).not.toBeInTheDocument();
      });
    });

    describe('with output-available state', () => {
      it('should render with output result', () => {
        const part = {
          type: 'tool-updateResume',
          state: 'output-available',
          input: {
            explanation: 'Updated your resume successfully',
            changes: { basics: { name: 'John Doe' } },
          },
          output: 'Resume updated successfully',
        };

        render(<Part part={part} />);

        expect(screen.getByText('📝 Updating resume...')).toBeInTheDocument();
        expect(
          screen.getByText('Updated your resume successfully')
        ).toBeInTheDocument();
        expect(
          screen.getByText('✓ Resume updated successfully')
        ).toBeInTheDocument();
      });

      it('should handle missing output gracefully', () => {
        const part = {
          type: 'tool-updateResume',
          state: 'output-available',
          input: {
            explanation: 'Update explanation',
          },
          // no output property
        };

        render(<Part part={part} />);

        expect(screen.getByText('📝 Updating resume...')).toBeInTheDocument();
        // Should not crash without output
      });
    });

    describe('with other states', () => {
      it('should not render for streaming state', () => {
        const part = {
          type: 'tool-updateResume',
          state: 'streaming',
          input: {
            explanation: 'This should not be visible',
          },
        };

        const { container } = render(<Part part={part} />);

        expect(container.firstChild).toBeNull();
      });

      it('should not render for call state', () => {
        const part = {
          type: 'tool-updateResume',
          state: 'call',
          input: {
            explanation: 'This should not be visible',
          },
        };

        const { container } = render(<Part part={part} />);

        expect(container.firstChild).toBeNull();
      });

      it('should not render for unknown states', () => {
        const part = {
          type: 'tool-updateResume',
          state: 'unknown-state',
          input: {
            explanation: 'This should not be visible',
          },
        };

        const { container } = render(<Part part={part} />);

        expect(container.firstChild).toBeNull();
      });
    });

    describe('styling and structure', () => {
      it('should apply correct CSS classes', () => {
        const part = {
          type: 'tool-updateResume',
          state: 'input-available',
          input: {
            explanation: 'Test explanation',
            changes: { basics: { name: 'Test' } },
          },
        };

        render(<Part part={part} />);

        const container = screen
          .getByText('📝 Updating resume...')
          .closest('div');
        expect(container).toHaveClass(
          'p-2',
          'rounded-lg',
          'bg-blue-50',
          'text-blue-900',
          'text-xs',
          'space-y-2'
        );
      });

      it('should format JSON changes with proper indentation', async () => {
        const part = {
          type: 'tool-updateResume',
          state: 'input-available',
          input: {
            changes: {
              work: [
                {
                  name: 'Company',
                  position: 'Engineer',
                  highlights: ['Feature 1', 'Feature 2'],
                },
              ],
            },
          },
        };

        render(<Part part={part} />);

        await userEvent.click(screen.getByText('View changes'));

        // Check for formatted JSON structure
        expect(screen.getByText('{', { exact: false })).toBeInTheDocument();
        expect(screen.getByText('}', { exact: false })).toBeInTheDocument();
      });
    });
  });

  describe('step indicators', () => {
    it('should not render step-start parts', () => {
      const part = {
        type: 'step-start',
        step: 'analyzing-resume',
      };

      const { container } = render(<Part part={part} />);

      expect(container.firstChild).toBeNull();
    });

    it('should not render step-finish parts', () => {
      const part = {
        type: 'step-finish',
        step: 'analyzing-resume',
        result: 'Analysis complete',
      };

      const { container } = render(<Part part={part} />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('unknown part types', () => {
    it('should not render unknown part types', () => {
      const part = {
        type: 'unknown-type',
        data: 'some data',
      };

      const { container } = render(<Part part={part} />);

      expect(container.firstChild).toBeNull();
    });

    it('should handle null part gracefully', () => {
      const { container } = render(<Part part={null} />);

      expect(container.firstChild).toBeNull();
    });

    it('should handle undefined part gracefully', () => {
      const { container } = render(<Part part={undefined} />);

      expect(container.firstChild).toBeNull();
    });

    it('should handle part without type', () => {
      const part = {
        text: 'Part without type',
      };

      const { container } = render(<Part part={part} />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('complex scenarios', () => {
    it('should handle deeply nested changes object', async () => {
      const part = {
        type: 'tool-updateResume',
        state: 'input-available',
        input: {
          explanation: 'Complex nested update',
          changes: {
            basics: {
              location: {
                address: '123 Main St',
                city: 'San Francisco',
                region: 'CA',
                profiles: [
                  {
                    network: 'LinkedIn',
                    url: 'https://linkedin.com/in/user',
                  },
                ],
              },
            },
            work: [
              {
                name: 'TechCorp',
                highlights: [
                  'Led team',
                  'Built features',
                  'Improved performance',
                ],
                technologies: ['React', 'Node.js', 'AWS'],
              },
            ],
          },
        },
      };

      render(<Part part={part} />);

      await userEvent.click(screen.getByText('View changes'));

      // Should render complex JSON structure
      expect(screen.getByText(/"TechCorp"/)).toBeInTheDocument();
      expect(screen.getByText(/"LinkedIn"/)).toBeInTheDocument();
      expect(screen.getByText(/"React"/)).toBeInTheDocument();
    });

    it('should handle very large changes object', async () => {
      const largeChanges = {
        work: Array.from({ length: 10 }, (_, i) => ({
          name: `Company ${i}`,
          position: `Position ${i}`,
          highlights: Array.from(
            { length: 5 },
            (_, j) => `Highlight ${i}-${j}`
          ),
        })),
      };

      const part = {
        type: 'tool-updateResume',
        state: 'input-available',
        input: {
          explanation: 'Adding multiple work experiences',
          changes: largeChanges,
        },
      };

      render(<Part part={part} />);

      await userEvent.click(screen.getByText('View changes'));

      // Should handle large JSON without crashing
      expect(screen.getByText(/"Company 0"/)).toBeInTheDocument();
      expect(screen.getByText(/"Company 9"/)).toBeInTheDocument();
    });
  });
});
