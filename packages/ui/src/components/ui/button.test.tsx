import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, buttonVariants } from './button';

describe('Button', () => {
  it('renders a <button> with its label', () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole('button', { name: 'Click me' });
    expect(btn).toBeInTheDocument();
    expect(btn.tagName).toBe('BUTTON');
  });

  it('applies default variant + size classes', () => {
    render(<Button>Default</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('bg-primary');
    expect(btn).toHaveClass('h-10');
  });

  it.each([
    ['destructive', 'bg-destructive'],
    ['outline', 'border-input'],
    ['secondary', 'bg-secondary'],
    ['ghost', 'hover:bg-accent'],
    ['link', 'underline-offset-4'],
  ] as const)('renders the %s variant', (variant, expectedClass) => {
    render(<Button variant={variant}>v</Button>);
    expect(screen.getByRole('button')).toHaveClass(expectedClass);
  });

  it.each([
    ['sm', 'h-9'],
    ['lg', 'h-11'],
    ['icon', 'w-10'],
  ] as const)('renders the %s size', (size, expectedClass) => {
    render(<Button size={size}>s</Button>);
    expect(screen.getByRole('button')).toHaveClass(expectedClass);
  });

  it('merges a custom className with variant classes', () => {
    render(<Button className="my-custom">x</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('my-custom');
    expect(btn).toHaveClass('bg-primary');
  });

  it('fires onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>go</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        no
      </Button>
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards a ref to the underlying button element', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>r</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('renders as a child element when asChild is set (Slot)', () => {
    render(
      <Button asChild>
        <a href="/somewhere">link button</a>
      </Button>
    );
    const link = screen.getByRole('link', { name: 'link button' });
    expect(link).toBeInTheDocument();
    // Slot forwards the button styling to the anchor.
    expect(link).toHaveClass('bg-primary');
  });

  it('forwards the type attribute', () => {
    render(<Button type="submit">submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('exposes buttonVariants helper that returns class strings', () => {
    expect(typeof buttonVariants({ variant: 'ghost' })).toBe('string');
    expect(buttonVariants({ variant: 'ghost' })).toContain('hover:bg-accent');
  });
});
