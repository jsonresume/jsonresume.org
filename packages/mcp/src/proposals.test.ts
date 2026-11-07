import { afterEach, describe, expect, it } from 'vitest';
import { connect, disposeEndpoint, setup } from './test/endpoint';

afterEach(disposeEndpoint);

describe('proposing instead of saving', () => {
  it('keeps the resume as it is and leaves a proposal for the person', async () => {
    const { handler, access } = await setup();
    const { call } = await connect(handler, access);
    const proposed = await call('update_resume_section', {
      section: 'skills',
      value: [{ name: 'Poetry' }],
      propose: true,
      note: 'Adds the skill your last job used',
    });
    expect(proposed.value).toMatchObject({
      saved: false,
      proposal_id: expect.any(String),
    });
    expect((await call('get_resume')).value.resume).toEqual({
      basics: { name: 'Ada', label: 'Engineer' },
    });
    const saved = await call('update_resume_section', {
      section: 'skills',
      value: [{ name: 'Poetry' }],
    });
    expect(saved.value).toMatchObject({ saved: true });
    expect(saved.value.proposal_id).toBeUndefined();
  });

  it('lists proposals, and accepts or rejects them when asked', async () => {
    const { handler, access } = await setup();
    const { call } = await connect(handler, access);
    for (const label of ['Poet', 'Painter'])
      await call('update_resume_section', {
        section: 'basics',
        value: { name: 'Ada', label },
        propose: true,
        note: label,
      });
    const { proposals } = (await call('list_proposals')).value;
    expect(proposals).toHaveLength(2);
    expect(proposals[0]).toMatchObject({
      note: 'Painter',
      changes: [{ path: 'basics.label', kind: 'changed' }],
    });
    const [painter, poet] = proposals;
    expect(
      (await call('decide_proposal', { id: poet.id, decision: 'reject' })).value
    ).toEqual({ decision: 'reject', version: null });
    const accepted = await call('decide_proposal', {
      id: painter.id,
      decision: 'accept',
    });
    expect(accepted.value).toMatchObject({ decision: 'accept' });
    expect((await call('get_resume')).value.resume).toEqual({
      basics: { name: 'Ada', label: 'Painter' },
    });
    expect((await call('list_proposals')).value.proposals).toEqual([]);
    const again = await call('decide_proposal', {
      id: painter.id,
      decision: 'accept',
    });
    expect(again.isError).toBe(true);
    expect(JSON.stringify(again.value)).toMatch(/No pending proposal/);
  });
});
