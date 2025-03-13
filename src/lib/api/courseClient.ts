import { Course, Hole } from '@/types';
import { ApiResponse, formatError } from './errorHandling';

interface CourseCreateData {
  name: string;
  holes: Array<{
    hole_number: number;
    par: number;
    distance: number;
  }>;
  totalPar: number;
  totalDistance: number;
}

/**
 * Fetch all courses
 */
export async function fetchCourses(): Promise<Course[]> {
  try {
    const response = await fetch('/api/courses');
    const result = await response.json() as ApiResponse<Course[]>;
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch courses');
    }
    
    return result.data || [];
  } catch (error) {
    throw formatError(error).error;
  }
}

/**
 * Fetch a single course with its holes
 */
export async function fetchCourse(id: string): Promise<Course> {
  try {
    const response = await fetch(`/api/courses/${id}`);
    const result = await response.json() as ApiResponse<Course>;
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch course');
    }
    
    return result.data!;
  } catch (error) {
    throw formatError(error).error;
  }
}

/**
 * Create a new course with holes
 */
export async function createCourse(courseData: CourseCreateData): Promise<Course> {
  try {
    const response = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData),
    });
    
    const result = await response.json() as ApiResponse<Course>;
    
    if (!response.ok) {
      const errorMessage = result.error || 'Failed to create course';
      const errorDetails = result.details ? `\n${result.details.join('\n')}` : '';
      throw new Error(`${errorMessage}${errorDetails}`);
    }
    
    return result.data!;
  } catch (error) {
    throw formatError(error).error;
  }
}

/**
 * Update an existing course
 */
export async function updateCourse(id: string, name: string): Promise<Course> {
  try {
    const response = await fetch(`/api/courses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    
    const result = await response.json() as ApiResponse<Course>;
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to update course');
    }
    
    return result.data!;
  } catch (error) {
    throw formatError(error).error;
  }
}

/**
 * Delete a course
 */
export async function deleteCourse(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/courses/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const result = await response.json() as ApiResponse<unknown>;
      throw new Error(result.error || 'Failed to delete course');
    }
  } catch (error) {
    throw formatError(error).error;
  }
}

/**
 * Add a hole to a course
 */
export async function addHole(courseId: string, holeData: Omit<Hole, 'id' | 'created_at'>): Promise<Hole> {
  try {
    const response = await fetch(`/api/courses/${courseId}/holes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(holeData),
    });
    
    const result = await response.json() as ApiResponse<Hole>;
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to add hole');
    }
    
    return result.data!;
  } catch (error) {
    throw formatError(error).error;
  }
}

/**
 * Update a hole
 */
export async function updateHole(holeId: string, holeData: Partial<Hole>): Promise<Hole> {
  try {
    const response = await fetch(`/api/holes/${holeId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(holeData),
    });
    
    const result = await response.json() as ApiResponse<Hole>;
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to update hole');
    }
    
    return result.data!;
  } catch (error) {
    throw formatError(error).error;
  }
}

/**
 * Delete a hole
 */
export async function deleteHole(holeId: string): Promise<void> {
  try {
    const response = await fetch(`/api/holes/${holeId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const result = await response.json() as ApiResponse<unknown>;
      throw new Error(result.error || 'Failed to delete hole');
    }
  } catch (error) {
    throw formatError(error).error;
  }
} 