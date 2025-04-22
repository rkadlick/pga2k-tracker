import { Course } from '@/types';

export const sortByAlphabetical = (a: Course, b: Course): number => {
  return a.name.localeCompare(b.name);
};

export const sortByWinPercentage = (a: Course, b: Course): number => {
  const aWins = a.wins || 0;
  const aLosses = a.losses || 0;
  const bWins = b.wins || 0;
  const bLosses = b.losses || 0;
  
  const aWinRate = aWins / (aWins + aLosses) || 0;
  const bWinRate = bWins / (bWins + bLosses) || 0;
  return bWinRate - aWinRate; // Sort high to low
};

export const sortByMostPlayed = (a: Course, b: Course): number => {
  const aTotal = (a.wins || 0) + (a.losses || 0);
  const bTotal = (b.wins || 0) + (b.losses || 0);
  return bTotal - aTotal; // Sort high to low
};

export type SortOption = 'alphabetical' | 'winPercentage' | 'mostPlayed';

export const sortCourses = (courses: Course[], sortBy: SortOption): Course[] => {
  const sortedCourses = [...courses];
  
  switch (sortBy) {
    case 'alphabetical':
      sortedCourses.sort(sortByAlphabetical);
      break;
    case 'winPercentage':
      sortedCourses.sort(sortByWinPercentage);
      break;
    case 'mostPlayed':
      sortedCourses.sort(sortByMostPlayed);
      break;
  }
  
  return sortedCourses;
}; 