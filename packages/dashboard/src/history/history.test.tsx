import type { ResumeVersionSummary } from '@repo/api';
import { act, fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vitest';
import { byline, changeSummary } from './describe';
import { VersionList } from './VersionList';

const now = new Date('2026-11-07T12:00:00Z');
const version = (
  n: number,
  actor: ResumeVersionSummary['actor'],
  extra: Partial<ResumeVersionSummary> = {}
): ResumeVersionSummary => ({
  version: n,
  createdAt: new Date(now.getTime() - n * 3_600_000).toISOString(),
  actor,
  note: null,
  changes: [
    { path: 'work[0].highlights', kind: 'changed' },
    { path: 'skills[2]', kind: 'added' },
  ],
  changeCount: 2,
  ...extra,
});
const versions = [
  version(
    3,
    { kind: 'restore', id: null, name: null },
    {
      note: 'Restored version 1',
    }
  ),
  version(
    2,
    { kind: 'assistant', id: 'jrc_1', name: 'Claude' },
    {
      changeCount: 6,
    }
  ),
  version(1, { kind: 'user', id: null, name: null }),
];

describe('history', () => {
  it('says who made each version and what changed', () => {
    expect(versions.map((v) => byline(v.actor))).toEqual([
      'Restored by you',
      'Claude (assistant)',
      'You',
    ]);
    expect(byline({ kind: 'app', id: 'k', name: null })).toBe('An app');
    expect(versions.map(changeSummary)).toEqual([
      'Restored version 1',
      'work[0].highlights changed, skills[2] added and 4 more',
      'work[0].highlights changed, skills[2] added',
    ]);
  });

  it('lists versions and restores one only after confirming', async () => {
    const onRestore = vi.fn(async () => true);
    const { container } = render(
      <VersionList
        versions={versions}
        current={3}
        busy={false}
        now={now}
        onRestore={onRestore}
      />
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText('Current')).toBeInTheDocument();
    expect(screen.getByText(/Claude \(assistant\)/)).toBeInTheDocument();
    // The current version has nothing to restore.
    expect(
      screen.queryByRole('button', { name: 'Restore version 3' })
    ).toBeNull();
    const result = await axe.run(container, {
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(result.violations.map((v) => v.id)).toEqual([]);

    fireEvent.click(screen.getByRole('button', { name: 'Restore version 1' }));
    expect(onRestore).not.toHaveBeenCalled();
    expect(
      await screen.findByRole('heading', { name: 'Restore version 1?' })
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', { name: /^Restore version 1$/ })
      );
    });
    expect(onRestore).toHaveBeenCalledWith(1);
  });
});
