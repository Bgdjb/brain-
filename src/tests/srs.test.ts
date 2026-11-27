import { describe, expect, it } from 'vitest';
import { schedule, DAY_MS, MIN_EASE } from '../utils/srs';

const fresh = { ease: 2.5, intervalDays: 0, reps: 0, lapses: 0 };
const NOW = 1_000_000;

describe('schedule', () => {
  it('good: 1 day, then 3 days, then x ease', () => {
    const a = schedule(fresh, 'good', NOW);
    expect(a.intervalDays).toBe(1);
    expect(a.due).toBe(NOW + DAY_MS);
    const b = schedule(a, 'good', NOW);
    expect(b.intervalDays).toBe(3);
    const c = schedule(b, 'good', NOW);
    expect(c.intervalDays).toBe(8);
  });
  it('again resets reps, counts a lapse and lowers ease', () => {
    const s = schedule({ ease: 2.5, intervalDays: 10, reps: 4, lapses: 0 }, 'again', NOW);
    expect(s).toMatchObject({ reps: 0, lapses: 1, intervalDays: 1 });
    expect(s.ease).toBeCloseTo(2.3);
  });
  it('ease never drops below the minimum', () => {
    let s = fresh;
    for (let i = 0; i < 20; i++) s = schedule(s, 'again', NOW);
    expect(s.ease).toBe(MIN_EASE);
  });
  it('easy gives an interval at least as long as good', () => {
    expect(schedule(fresh, 'easy', NOW).intervalDays).toBeGreaterThanOrEqual(schedule(fresh, 'good', NOW).intervalDays);
  });
});
