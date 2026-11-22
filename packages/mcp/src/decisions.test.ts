import { afterEach, describe, expect, it } from 'vitest';
import { connect, disposeEndpoint, setup } from './test/endpoint';

afterEach(disposeEndpoint);

describe('decision tools', () => {
  it('keeps preferences, changing only the fields given', async () => {
    const { handler, key, events } = await setup();
    const { call } = await connect(handler, key);
    const empty = (await call('get_job_preferences')).value;
    expect(empty).toMatchObject({
      workplaces: [],
      payFloor: null,
      direction: '',
    });
    await call('set_job_preferences', {
      workplaces: ['remote_global'],
      payFloor: 150000,
      avoidSectors: ['gambling'],
    });
    const saved = (
      await call('set_job_preferences', { direction: '  AI agents  ' })
    ).value;
    expect(saved).toMatchObject({
      workplaces: ['remote_global'],
      payFloor: 150000,
      avoidSectors: ['gambling'],
      direction: 'AI agents',
    });
    expect(events.filter((e) => e.event === 'job_preferences_saved')).toEqual([
      expect.objectContaining({
        properties: expect.objectContaining({
          source: 'agent',
          changed: 'workplaces,payFloor,avoidSectors',
          workplaces: 'remote_global',
          pay_floor: true,
          avoid_sectors: 'gambling',
          direction: false,
        }),
      }),
      expect.objectContaining({
        properties: expect.objectContaining({
          changed: 'direction',
          avoid_sectors: 'gambling',
          direction: true,
        }),
      }),
    ]);
  });

  it('decides with what they stated, and says so', async () => {
    const { handler, key } = await setup();
    const { call } = await connect(handler, key);
    await call('save_resume', {
      resume: {
        basics: { name: 'Ada', label: 'Senior TypeScript engineer' },
        skills: [{ name: 'Web', keywords: ['TypeScript', 'React'] }],
      },
    });
    expect((await call('decide_jobs')).value).toMatchObject({
      stated: false,
      total: 0,
      jobs: [],
      suggestions: [],
    });
    await call('set_job_preferences', { needsVisa: true });
    expect((await call('decide_jobs')).value.stated).toBe(true);
  });
});
