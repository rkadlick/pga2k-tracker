import { HoleData } from '@/hooks/useCourseForm';

/**
 * Validation rules for course data that can be used on both client and server
 */

// Course name validation
export function validateCourseName(name: string): string | null {
  if (!name || !name.trim()) {
    return 'Course name is required';
  }
  
  if (name.trim().length < 3) {
    return 'Course name must be at least 3 characters';
  }
  
  if (name.trim().length > 100) {
    return 'Course name must be less than 100 characters';
  }
  
  return null;
}

// Hole par validation
export function validateHolePar(par: number | null): string | null {
  if (par === null) {
    return 'Par is required';
  }
  
  if (par < 2 || par > 6) {
    return 'Par must be between 2 and 6';
  }
  
  return null;
}

// Hole distance validation
export function validateHoleDistance(distance: number | null): string | null {
  if (distance === null) {
    return 'Distance is required';
  }
  
  if (distance <= 0) {
    return 'Distance must be positive';
  }
  
  if (distance > 1000) {
    return 'Distance must be less than 1000 yards';
  }
  
  return null;
}

// Validate a single hole
export function validateHole(hole: HoleData): string | null {
  const parError = validateHolePar(hole.par);
  if (parError) return parError;
  
  const distanceError = validateHoleDistance(hole.distance);
  if (distanceError) return distanceError;
  return null;
}

// Validate all holes in a course
export function validateHoles(holes: HoleData[]): string[] {
  if (!holes || !Array.isArray(holes)) {
    return ['Holes data is required'];
  }
  
  if (holes.length !== 18) {
    return ['A course must have exactly 18 holes'];
  }
  
  return holes.map((hole, index) => {
    const error = validateHole(hole);
    console.log('error', error);
    return error ? `Hole ${index + 1}: ${error}` : '';
  }).filter(error => error !== '');
}

// Validate entire course
export function validateCourse(
  courseName: string, 
  holes: HoleData[]
): { courseName: string; holes: string[] } {
  return {
    courseName: validateCourseName(courseName) || '',
    holes: validateHoles(holes).filter(error => error !== '')
  };
}

// Check if validation result has any errors
export function hasValidationErrors(
  validationResult: { courseName: string; holes: string[] }
): boolean {
  return !!(validationResult.courseName || validationResult.holes.length > 0);
} 