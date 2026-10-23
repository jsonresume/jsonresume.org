import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  AccountMenu,
  BackLink,
  Banner,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  LoadMore,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  TabNav,
  TabNavLink,
  Toaster,
  pageWindow,
  toast,
} from '../index';
import { axeViolations } from '../test/axe';

describe('DropdownMenu', () => {
  it('opens from the keyboard, moves with arrows and selects with Enter', async () => {
    const onDelete = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem tone="danger" onSelect={onDelete}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    screen.getByRole('button', { name: 'Actions' }).focus();
    await userEvent.keyboard('{Enter}');
    const menu = await screen.findByRole('menu');
    expect(await axeViolations(menu)).toEqual([]);
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(onDelete).toHaveBeenCalledOnce();
  });
});

describe('Popover', () => {
  it('opens a labelled dialog and closes on Escape', async () => {
    render(
      <Popover>
        <PopoverTrigger asChild>
          <Button>Details</Button>
        </PopoverTrigger>
        <PopoverContent aria-label="Job details">Remote · $150k</PopoverContent>
      </Popover>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Details' }));
    expect(
      await screen.findByRole('dialog', { name: 'Job details' })
    ).toHaveTextContent('Remote');
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('Sheet', () => {
  it('is a labelled modal dialog with focus inside', async () => {
    render(
      <Sheet>
        <SheetTrigger asChild>
          <Button>Filters</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Narrow the job list.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Filters' }));
    const sheet = screen.getByRole('dialog', { name: 'Filters' });
    expect(sheet).toHaveAccessibleDescription('Narrow the job list.');
    expect(sheet.contains(document.activeElement)).toBe(true);
    expect(await axeViolations(sheet)).toEqual([]);
  });
});

describe('Toast', () => {
  it('shows a toast in a labelled region and runs its action', async () => {
    const undo = vi.fn();
    render(<Toaster />);
    act(() => {
      toast({
        title: 'Resume saved',
        tone: 'success',
        action: { label: 'Undo', altText: 'Undo save', onClick: undo },
      });
    });
    expect(await screen.findByText('Resume saved')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(undo).toHaveBeenCalledOnce();
  });
});

describe('Banner', () => {
  it('is a named region that can be dismissed', async () => {
    const onDismiss = vi.fn();
    render(
      <Banner label="Public view" dismissible onDismiss={onDismiss}>
        You are viewing a public dashboard.
      </Banner>
    );
    const region = screen.getByRole('region', { name: 'Public view' });
    expect(await axeViolations(region)).toEqual([]);
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});

describe('navigation', () => {
  it('marks the current tab link', async () => {
    const { container } = render(
      <TabNav label="Profile">
        <TabNavLink href="/dashboard" active>
          Dashboard
        </TabNavLink>
        <TabNavLink href="/jobs">Jobs</TabNavLink>
      </TabNav>
    );
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(await axeViolations(container)).toEqual([]);
  });

  it('computes a page window with gaps', () => {
    expect(pageWindow(1, 1)).toEqual([1]);
    expect(pageWindow(5, 10)).toEqual([1, 'gap', 4, 5, 6, 'gap', 10]);
    expect(pageWindow(3, 10)).toEqual([1, 2, 3, 4, 'gap', 10]);
  });

  it('paginates with links or callbacks', async () => {
    const onPageChange = vi.fn();
    const { rerender, container } = render(
      <Pagination page={2} pageCount={5} href={(p) => `?page=${p}`} />
    );
    expect(screen.getByRole('link', { name: 'Page 2' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(screen.getByRole('link', { name: 'Next' })).toHaveAttribute(
      'href',
      '?page=3'
    );
    expect(await axeViolations(container)).toEqual([]);
    rerender(<Pagination page={1} pageCount={5} onPageChange={onPageChange} />);
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    // Page 1 of 5 shows 1, 2, …, 5.
    expect(
      screen.queryByRole('button', { name: 'Page 3' })
    ).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Page 2' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('loads more until everything is shown', async () => {
    const onLoadMore = vi.fn();
    const { rerender } = render(
      <LoadMore shown={20} total={45} onLoadMore={onLoadMore} />
    );
    expect(screen.getByText('Showing 20 of 45')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Load more' }));
    expect(onLoadMore).toHaveBeenCalledOnce();
    rerender(<LoadMore shown={45} total={45} onLoadMore={onLoadMore} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('names the back link by its destination', () => {
    render(<BackLink href="/jobs">Back to jobs</BackLink>);
    expect(screen.getByRole('link', { name: /Back to jobs/ })).toHaveAttribute(
      'href',
      '/jobs'
    );
  });

  it('opens the account menu with header and sign out', async () => {
    const onSignOut = vi.fn();
    render(
      <AccountMenu
        name="Thomas Davis"
        email="thomas@example.com"
        onSignOut={onSignOut}
      >
        <DropdownMenuItem>Settings</DropdownMenuItem>
      </AccountMenu>
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Account: Thomas Davis' })
    );
    const menu = await screen.findByRole('menu');
    expect(within(menu).getByText('thomas@example.com')).toBeInTheDocument();
    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Sign out' })
    );
    expect(onSignOut).toHaveBeenCalledOnce();
  });
});
