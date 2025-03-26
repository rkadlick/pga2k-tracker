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
    case 'full':
      return 'Full 18';
    default:
      return ninePlayed;
  }
} 