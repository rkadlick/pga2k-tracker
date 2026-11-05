import { NinePlayed } from '@/types';

/**
 * Formats a nine_played value for display
 */
export function formatNinePlayed(ninePlayed: NinePlayed): string {
  switch (ninePlayed) {
    case 'front':
      return 'Front 9';
    case 'back':
      return 'Back 9';
    default:
      return ninePlayed;
  }
}

/**
 * Sums values, or returns null if any are missing so a partial total isn't shown as the full one
 */
export function sumIfComplete(values: (number | null)[]): number | null {
  let total = 0;
  for (const value of values) {
    if (value === null) return null;
    total += value;
  }
  return total;
}
