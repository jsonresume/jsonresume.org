import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './input';

describe('Input', () => {
  it('renders a textbox with base classes', () => {
    render(<Input aria-label="name" />);
    const input = screen.getByRole('textbox', { name: 'name' });
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('rounded-md');
    expect(input).toHaveClass('border-input');
  });

  it('renders the placeholder', () => {
    render(<Input placeholder="Your name" />);
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
  });

  it('forwards the type attribute', () => {
    render(<Input type="password" aria-label="pw" />);
    expect(screen.getByLabelText('pw')).toHaveAttribute('type', 'password');
  });

  it('merges a custom className', () => {
    render(<Input className="w-64" aria-label="x" />);
    const input = screen.getByLabelText('x');
    expect(input).toHaveClass('w-64');
    expect(input).toHaveClass('border-input');
  });

  it('calls onChange for each typed character', async () => {
    const onChange = vi.fn();
    render(<Input aria-label="typed" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('typed'), 'abc');
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it('reflects a controlled value', () => {
    render(<Input value="hello" readOnly aria-label="ctrl" />);
    expect(screen.getByLabelText('ctrl')).toHaveValue('hello');
  });

  it('honours the disabled attribute', () => {
    render(<Input disabled aria-label="d" />);
    expect(screen.getByLabelText('d')).toBeDisabled();
  });

  it('forwards a ref to the input element', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} aria-label="r" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
