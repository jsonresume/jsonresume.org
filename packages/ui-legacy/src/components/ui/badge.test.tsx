import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge, badgeVariants } from './badge';

describe('Badge', () => {
  it('renders its content with the default variant classes', () => {
    render(<Badge>New</Badge>);
    const badge = screen.getByText('New');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-primary');
    expect(badge).toHaveClass('rounded-full');
  });

  it.each([
    ['secondary', 'bg-secondary'],
    ['destructive', 'bg-destructive'],
    ['outline', 'text-foreground'],
  ] as const)('renders the %s variant', (variant, expectedClass) => {
    render(<Badge variant={variant}>{variant}</Badge>);
    expect(screen.getByText(variant)).toHaveClass(expectedClass);
  });

  it('merges a custom className', () => {
    render(<Badge className="uppercase">tag</Badge>);
    const badge = screen.getByText('tag');
    expect(badge).toHaveClass('uppercase');
    expect(badge).toHaveClass('rounded-full');
  });

  it('forwards arbitrary html attributes', () => {
    render(<Badge data-testid="b">x</Badge>);
    expect(screen.getByTestId('b')).toBeInTheDocument();
  });

  it('exposes badgeVariants returning class strings', () => {
    expect(typeof badgeVariants({ variant: 'outline' })).toBe('string');
    expect(badgeVariants({ variant: 'outline' })).toContain('text-foreground');
  });
});
