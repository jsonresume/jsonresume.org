import type { JobPreferences } from '@repo/api';
import { describe, expect, it } from 'vitest';
import { noFacts, type CompanyFacts } from '../facts';
import type { Posting } from '../posting';
import { noPreferences } from '../preferences';
import { posting } from '../test/fixtures';
import { byDecision, decide } from './decide';
import { suggestions } from './suggest';
import type { DecisionInput, Need } from './types';

const need = (name: string, extra: Partial<Need> = {}): Need => ({
  key: name.toLowerCase(),
  name,
  need: 'required',
  years: null,
  ...extra,
});

const input = (
  over: {
    posting?: Partial<Posting>;
    facts?: Partial<CompanyFacts>;
    want?: Partial<JobPreferences>;
  } & Partial<Omit<DecisionInput, 'posting' | 'facts' | 'preferences'>> = {}
): DecisionInput => {
  const { posting: p, facts, want, ...rest } = over;
  return {
    posting: posting({ seniority: 'senior', remote: 'remote_global', ...p }),
    facts: { ...noFacts, ...facts },
    eligible: 'yes',
    placed: true,
    fit: 80,
    cosine: 0.55,
    order: 0.55,
    needs: [need('TypeScript'), need('React')],
    have: new Map([
      ['typescript', { weight: 1, years: 8 }],
      ['react', { weight: 0.8, years: 6 }],
    ]),
    level: 'senior',
    preferences: { ...noPreferences, ...want },
    direction: null,
    ...rest,
  };
};

describe('the decision model', () => {
  it('applies to a job they can get and would want', () => {
    const d = decide(input());
    expect(d.verdict).toBe('apply');
    expect(d.shown).toEqual(['TypeScript', 'React']);
    expect(d.reasons[0]?.text).toBe('You show all 2 required skills');
    expect(d.value).toBe(Math.round(d.appeal * (0.5 + d.chance / 200)));
  });

  it('rules out dealbreakers with the reason, unknowns pass', () => {
    const want = { payFloor: 150_000, workplaces: ['remote_global' as const] };
    const low = decide(input({ want, posting: { salaryMax: 90_000 } }));
    expect(low.verdict).toBe('ruled_out');
    expect(low.reasons[0]).toEqual({
      factor: 'pay',
      tone: 'bad',
      text: 'Pays up to $90k; your floor is $150k',
    });
    expect(decide(input({ want })).verdict).toBe('apply');
    const office = decide(input({ want, posting: { remote: 'onsite' } }));
    expect(office.reasons[0]?.text).toBe(
      'In an office; you want remote work anywhere'
    );
    const gambling = decide(
      input({
        want: { avoidSectors: ['gambling'] },
        facts: { sectors: ['gambling'] },
      })
    );
    expect(gambling.verdict).toBe('ruled_out');
    expect(decide(input({ eligible: 'no' })).verdict).toBe('ruled_out');
    const php = decide(input({ want: { avoidSkills: ['typescript'] } }));
    expect(php.reasons[0]?.text).toBe(
      "Needs TypeScript, which you'd rather not use"
    );
  });

  it('calls a job with gaps a stretch, naming what is missing', () => {
    const d = decide(
      input({
        fit: 55,
        needs: [need('TypeScript'), need('Kubernetes'), need('Go')],
        want: { likeSectors: ['developer_tools'] },
        facts: { sectors: ['developer_tools'] },
      })
    );
    expect(d.verdict).toBe('stretch');
    expect(d.missing).toEqual(['Kubernetes', 'Go']);
    expect(d.reasons.map((r) => r.text)).toContain('Missing Kubernetes and Go');
    expect(d.reasons.map((r) => r.text)).toContain('Developer tools');
  });

  it('counts years: a requirement shown for too few years is partly met', () => {
    const full = decide(input());
    const short = decide(
      input({ needs: [need('TypeScript', { years: 16 }), need('React')] })
    );
    expect(short.chance).toBeLessThan(full.chance);
    expect(short.reasons.map((r) => r.text)).toContain(
      'Asks for TypeScript (16+ years)'
    );
  });

  it('weighs levels: a step down is less appealing, two steps up less likely', () => {
    const down = decide(input({ posting: { seniority: 'junior' } }));
    expect(down.appeal).toBeLessThan(decide(input()).appeal);
    expect(down.reasons.map((r) => r.text)).toContain(
      'A step down from your level'
    );
    const up = decide(
      input({ level: 'mid', posting: { seniority: 'staff_plus' } })
    );
    expect(up.chance).toBeLessThan(decide(input()).chance);
  });

  it('lets priorities weigh what they care about most', () => {
    const pay = { payTarget: 150_000, payFloor: null };
    const job = { salaryMax: 200_000 };
    const plain = decide(input({ want: pay, posting: job }));
    const first = decide(
      input({ want: { ...pay, priorities: ['pay'] }, posting: job })
    );
    expect(first.appeal).toBeGreaterThan(plain.appeal);
  });

  it('orders by verdict, then expected value', () => {
    const jobs = [
      { decision: decide(input({ eligible: 'no' })) },
      { decision: decide(input({ fit: 70 })) },
      { decision: decide(input({ fit: 95 })) },
    ];
    expect([...jobs].sort(byDecision).map((j) => j.decision.verdict)).toEqual([
      'apply',
      'apply',
      'ruled_out',
    ]);
    expect([...jobs].sort(byDecision)[0]?.decision.chance).toBeGreaterThan(
      [...jobs].sort(byDecision)[1]?.decision.chance ?? 100
    );
  });

  it('falls back to the cosine when nothing is judged or read yet', () => {
    const d = decide(input({ fit: null, needs: null, cosine: 0.62 }));
    expect(d.chance).toBe(90);
    expect(d.shown).toEqual([]);
  });
});

describe('suggestions from marks', () => {
  const mark = (
    state: 'interested' | 'not_interested',
    sector: 'adtech_marketing' | 'ai_ml',
    remote: 'onsite' | 'remote_global' = 'remote_global'
  ) => ({ state, reason: null, sectors: [sector], remote });

  it('suggests leaving out a sector they keep passing on, unless dismissed', () => {
    const marks = [1, 2, 3].map(() =>
      mark('not_interested', 'adtech_marketing')
    );
    const [s] = suggestions(marks, noPreferences);
    expect(s?.text).toBe(
      'You passed on 3 adtech and marketing jobs. Leave adtech and marketing out?'
    );
    expect(s?.preferences.avoidSectors).toEqual(['adtech_marketing']);
    expect(
      suggestions(marks, {
        ...noPreferences,
        dismissed: ['avoid:adtech_marketing'],
      })
    ).toEqual([]);
  });

  it('suggests remote only when every office job was passed on', () => {
    const marks = [1, 2, 3].map(() =>
      mark('not_interested', 'ai_ml', 'onsite')
    );
    expect(suggestions(marks, noPreferences).map((s) => s.id)).toContain(
      'workplace:remote'
    );
  });
});

describe('ranking metrics', () => {
  it('measures AUC and precision against hand-computed values', async () => {
    const { auc, precisionAt } = await import('./metrics');
    const items = [
      { score: 0.9, liked: true },
      { score: 0.8, liked: false },
      { score: 0.7, liked: true },
      { score: 0.1, liked: false },
    ];
    // Pairs (liked above passed): 0.9>0.8, 0.9>0.1, 0.7<0.8, 0.7>0.1 = 3/4.
    expect(auc(items)).toBe(0.75);
    expect(precisionAt(items, 2)).toBe(0.5);
    expect(auc([{ score: 1, liked: true }])).toBeNull();
  });
});
