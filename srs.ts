export type Rating = 'again' | 'hard' | 'good' | 'easy';

export interface SrsState {
  ease: number;
  intervalDays: number;
  reps: number;
  lapses: number;
}

export const DAY_MS = 86_400_000;
export const MIN_EASE = 1.3;

/**
 * Simplified SM-2.
 * again: interval resets to 1 day, ease -0.2, lapse counted.
 * hard:  interval x1.2, ease -0.15.
 * good:  first 1 day, second 3 days, then interval x ease.
 * easy:  like good with x1.3 bonus, ease +0.15.
 */
export function schedule(state: SrsState, rating: Rating, now: number): SrsState & { due: number } {
  let { ease, intervalDays, reps, lapses } = state;
  if (rating === 'again') {
    reps = 0;
    lapses += 1;
    intervalDays = 1;
    ease = Math.max(MIN_EASE, ease - 0.2);
  } else {
    const base = reps === 0 ? 1 : reps === 1 ? 3 : intervalDays * ease;
    if (rating === 'hard') {
      intervalDays = Math.max(1, Math.round(reps === 0 ? 1 : intervalDays * 1.2));
      ease = Math.max(MIN_EASE, ease - 0.15);
    } else if (rating === 'good') {
      intervalDays = Math.max(1, Math.round(base));
    } else {
      intervalDays = Math.max(1, Math.round(base * 1.3));
      ease += 0.15;
    }
    reps += 1;
  }
  return { ease, intervalDays, reps, lapses, due: now + intervalDays * DAY_MS };
}
