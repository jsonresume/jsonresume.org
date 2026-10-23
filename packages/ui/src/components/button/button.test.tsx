import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Button } from './button';

describe('Button', () => {
  it('is a button of type "button" by default', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute(
      'type',
      'button'
    );
  });

  it('calls onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('applies variant and size classes', () => {
    const { rerender } = render(<Button>A</Button>);
    const secondary = screen.getByRole('button').className;
    rerender(
      <Button variant="primary" size="lg">
        A
      </Button>
    );
    expect(screen.getByRole('button').className).not.toBe(secondary);
  });

  it('keeps its accessible name and blocks clicks while loading', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Publish
      </Button>
    );
    const btn = screen.getByRole('button', { name: 'Publish' });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders its child with button styles when asChild', () => {
    render(
      <Button asChild variant="primary">
        <a href="/docs">Docs</a>
      </Button>
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('href', '/docs');
    expect(link.className).toMatch(/\S/);
    expect(link).not.toHaveAttribute('type');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <Button>One</Button>
        <Button variant="primary" loading>
          Two
        </Button>
        <Button size="icon" aria-label="Search">
          <svg aria-hidden="true" />
        </Button>
      </div>
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});
