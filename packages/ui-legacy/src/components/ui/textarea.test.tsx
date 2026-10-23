import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './textarea';

describe('Textarea', () => {
  it('renders a textbox with base classes', () => {
    render(<Textarea aria-label="bio" />);
    const ta = screen.getByRole('textbox', { name: 'bio' });
    expect(ta).toBeInTheDocument();
    expect(ta.tagName).toBe('TEXTAREA');
    expect(ta).toHaveClass('min-h-[80px]');
  });

  it('renders the placeholder', () => {
    render(<Textarea placeholder="Tell us more" />);
    expect(screen.getByPlaceholderText('Tell us more')).toBeInTheDocument();
  });

  it('merges a custom className', () => {
    render(<Textarea className="h-40" aria-label="x" />);
    const ta = screen.getByLabelText('x');
    expect(ta).toHaveClass('h-40');
    expect(ta).toHaveClass('border-input');
  });

  it('calls onChange when typed into', async () => {
    const onChange = vi.fn();
    render(<Textarea aria-label="t" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('t'), 'hi');
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('reflects a controlled value', () => {
    render(<Textarea value="content" readOnly aria-label="ctrl" />);
    expect(screen.getByLabelText('ctrl')).toHaveValue('content');
  });

  it('honours the disabled attribute', () => {
    render(<Textarea disabled aria-label="d" />);
    expect(screen.getByLabelText('d')).toBeDisabled();
  });

  it('passes through the rows attribute', () => {
    render(<Textarea rows={8} aria-label="r" />);
    expect(screen.getByLabelText('r')).toHaveAttribute('rows', '8');
  });

  it('forwards a ref to the textarea element', () => {
    const ref = { current: null as HTMLTextAreaElement | null };
    render(<Textarea ref={ref} aria-label="ref" />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
