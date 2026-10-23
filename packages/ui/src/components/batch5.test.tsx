import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Button,
  GraphControls,
  GraphLegend,
  GraphRegion,
  Panel,
  ShortcutHelp,
  SplitView,
  SwipeDeck,
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  VirtualList,
  formatShortcut,
} from '../index';
import { axeViolations } from '../test/axe';

describe('Panel', () => {
  it('is a region named by its title, with actions and footer', async () => {
    const { container } = render(
      <Panel
        title="Job details"
        actions={<Button size="sm">Close</Button>}
        footer={<Button>Apply</Button>}
        maxHeight="20rem"
      >
        Body
      </Panel>
    );
    expect(
      screen.getByRole('region', { name: 'Job details' })
    ).toHaveTextContent('Body');
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('Toolbar', () => {
  it('is a labelled toolbar of buttons', async () => {
    const onBold = vi.fn();
    const { container } = render(
      <Toolbar label="Editor">
        <ToolbarButton onClick={onBold}>Format</ToolbarButton>
        <ToolbarSeparator />
        <ToolbarButton>Undo</ToolbarButton>
      </Toolbar>
    );
    expect(screen.getByRole('toolbar', { name: 'Editor' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Format' }));
    expect(onBold).toHaveBeenCalledOnce();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('SplitView', () => {
  it('resizes panes from the keyboard within limits', async () => {
    const onSizesChange = vi.fn();
    const { container } = render(
      <SplitView
        paneLabels={['Editor', 'Preview']}
        defaultSizes={[50, 50]}
        minSize={20}
        onSizesChange={onSizesChange}
      >
        <div>Editor</div>
        <div>Preview</div>
      </SplitView>
    );
    const sep = screen.getByRole('separator', {
      name: 'Resize Editor and Preview',
    });
    expect(sep).toHaveAttribute('aria-valuenow', '50');
    sep.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(sep).toHaveAttribute('aria-valuenow', '52');
    await userEvent.keyboard('{End}');
    expect(sep).toHaveAttribute('aria-valuenow', '80');
    await userEvent.keyboard('{Home}');
    expect(sep).toHaveAttribute('aria-valuenow', '20');
    expect(onSizesChange).toHaveBeenLastCalledWith([20, 80]);
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('VirtualList', () => {
  it('renders a labelled list region with set positions', () => {
    render(
      <VirtualList
        label="Activity"
        height="200px"
        items={Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`)}
        renderItem={(t) => t}
      />
    );
    expect(
      screen.getByRole('region', { name: 'Activity' })
    ).toBeInTheDocument();
    const rows = screen.queryAllByRole('listitem');
    expect(rows.length).toBeLessThan(1000);
    rows.forEach((r) => expect(r).toHaveAttribute('aria-setsize', '1000'));
  });
});

describe('Shortcuts', () => {
  it('formats keys and opens help with ?', async () => {
    expect(formatShortcut('mod+k')).toHaveLength(2);
    expect(formatShortcut('shift+arrowleft')[1]).toBe('←');
    render(
      <ShortcutHelp
        groups={[
          {
            title: 'Graph',
            shortcuts: [{ keys: 'j', description: 'Next job' }],
          },
        ]}
      />
    );
    act(() => {
      fireEvent.keyDown(window, { key: '?', shiftKey: true });
    });
    const dialog = await screen.findByRole('dialog', {
      name: 'Keyboard shortcuts',
    });
    expect(dialog).toHaveTextContent('Next job');
    expect(await axeViolations(dialog)).toEqual([]);
  });
});

describe('SwipeDeck', () => {
  it('decides with buttons and arrow keys and announces each decision', async () => {
    const onDecision = vi.fn();
    const { container } = render(
      <SwipeDeck
        items={['Stripe', 'Vercel']}
        itemLabel={(i) => i}
        renderCard={(i) => <p>{i}</p>}
        onDecision={onDecision}
      />
    );
    expect(await axeViolations(container)).toEqual([]);
    await userEvent.click(screen.getByRole('button', { name: 'Interested' }));
    expect(onDecision).toHaveBeenLastCalledWith('Stripe', 'right');
    expect(screen.getByText('Interested: Stripe.')).toBeInTheDocument();
    screen.getByRole('group', { name: /Vercel/ }).focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(onDecision).toHaveBeenLastCalledWith('Vercel', 'left');
    expect(screen.getByText('No more cards')).toBeInTheDocument();
  });
});

describe('Graph kit', () => {
  it('labels the region, controls and legend', async () => {
    const onFit = vi.fn();
    const { container } = render(
      <GraphRegion
        label="Job similarity graph"
        description="Jobs closer together are more alike."
      >
        <GraphControls onZoomIn={() => {}} onZoomOut={() => {}} onFit={onFit} />
        <GraphLegend items={[{ label: 'Your resume', color: 'red' }]} />
      </GraphRegion>
    );
    expect(
      screen.getByRole('region', { name: 'Job similarity graph' })
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Fit to view' }));
    expect(onFit).toHaveBeenCalledOnce();
    expect(await axeViolations(container)).toEqual([]);
  });
});
