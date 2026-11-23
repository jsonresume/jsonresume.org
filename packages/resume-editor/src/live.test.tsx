import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Live } from './Live';

describe('the first save', () => {
  it('shows where the page is live, to copy and to see', () => {
    render(<Live username="ada" />);
    expect(screen.getByText('Your resume is live')).toBeInTheDocument();
    const page = screen.getByRole('link', { name: /\/@ada$/ });
    expect(page.getAttribute('href')).toBe('/@ada');
    expect(
      screen.getByRole('button', { name: /copy your link/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'View your page' }).getAttribute('href')
    ).toBe('/@ada');
  });
});
