import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  LoadingSkeleton,
  EditorLoadingSkeleton,
  DashboardLoadingSkeleton,
  JobsLoadingSkeleton,
} from './LoadingSkeleton';

describe('LoadingSkeleton', () => {
  it('renders basic skeleton structure', () => {
    const { container } = render(<LoadingSkeleton />);

    // Should have animate-pulse class
    const pulsingDiv = container.querySelector('.animate-pulse');
    expect(pulsingDiv).toBeInTheDocument();

    // Should have multiple skeleton elements
    const skeletons = container.querySelectorAll('.bg-gray-200');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders with correct spacing', () => {
    const { container } = render(<LoadingSkeleton />);
    const pulsingDiv = container.querySelector('.animate-pulse');
    expect(pulsingDiv).toHaveClass('space-y-4');
  });
});

describe('EditorLoadingSkeleton', () => {
  it('renders editor skeleton with grid layout', () => {
    const { container } = render(<EditorLoadingSkeleton />);

    // Should have grid for editor panels
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid-cols-1', 'lg:grid-cols-2');
  });

  it('renders two editor panel skeletons', () => {
    const { container } = render(<EditorLoadingSkeleton />);

    // Should have two white panels (left and right)
    const panels = container.querySelectorAll('.bg-white.rounded-lg.shadow');
    expect(panels).toHaveLength(2);
  });

  it('has animation on container', () => {
    const { container } = render(<EditorLoadingSkeleton />);
    const animatedDiv = container.querySelector('.animate-pulse');
    expect(animatedDiv).toBeInTheDocument();
  });
});

describe('DashboardLoadingSkeleton', () => {
  it('renders dashboard skeleton with stats cards', () => {
    const { container } = render(<DashboardLoadingSkeleton />);

    // Should have 3 stat cards
    const statsGrid = container.querySelector('.md\\:grid-cols-3');
    expect(statsGrid).toBeInTheDocument();

    const cards = statsGrid?.querySelectorAll('.bg-white');
    expect(cards).toHaveLength(3);
  });

  it('renders header with two elements', () => {
    const { container } = render(<DashboardLoadingSkeleton />);

    // Header should have flex layout with two items
    const header = container.querySelector(
      '.flex.items-center.justify-between'
    );
    expect(header).toBeInTheDocument();

    const headerItems = header?.querySelectorAll('.bg-gray-200');
    expect(headerItems).toHaveLength(2);
  });

  it('renders content area with list items', () => {
    const { container } = render(<DashboardLoadingSkeleton />);

    // Should have 4 list items (h-16 gray rectangles)
    const listItems = container.querySelectorAll('.h-16.bg-gray-100');
    expect(listItems).toHaveLength(4);
  });
});

describe('JobsLoadingSkeleton', () => {
  it('renders jobs skeleton with multiple job cards', () => {
    const { container } = render(<JobsLoadingSkeleton />);

    // Should have 5 job cards
    const jobCards = container.querySelectorAll(
      '.bg-white.rounded-lg.shadow.p-6'
    );
    expect(jobCards).toHaveLength(5);
  });

  it('each job card has title and description skeletons', () => {
    const { container } = render(<JobsLoadingSkeleton />);

    const firstCard = container.querySelector(
      '.bg-white.rounded-lg.shadow.p-6'
    );
    expect(firstCard).toBeInTheDocument();

    // Should have title skeleton (h-6)
    const titleSkeleton = firstCard?.querySelector('.h-6.bg-gray-200');
    expect(titleSkeleton).toBeInTheDocument();

    // Should have description skeletons (h-4)
    const descSkeletons = firstCard?.querySelectorAll('.h-4.bg-gray-100');
    expect(descSkeletons?.length).toBeGreaterThan(0);
  });

  it('has consistent animation across all skeletons', () => {
    const { container } = render(<JobsLoadingSkeleton />);
    const animatedDiv = container.querySelector('.animate-pulse');
    expect(animatedDiv).toBeInTheDocument();
  });
});
