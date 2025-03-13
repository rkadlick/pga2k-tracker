import { useState, useEffect, useCallback, useRef } from 'react';
import { Course } from '@/types';
import { fetchCourses, createCourse, deleteCourse } from '@/lib/api/courseClient';

/**
 * A hook for managing courses data and operations
 */
export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Use a ref to prevent the effect from running more than once
  const initialized = useRef(false);
  
  // Load courses on mount only
  useEffect(() => {
    // Only run once
    if (!initialized.current) {
      loadCourses();
      initialized.current = true;
    }
    
    // No cleanup needed for this effect
  }, []); // Empty dependency array ensures this only runs once

  // Function to load courses
  const loadCourses = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchCourses();
      setCourses(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Create a course with holes
  const createCourseWithHoles = useCallback(async (
    courseName: string,
    holes: Array<{
      hole_number: number;
      par: number | null;
      distance: number | null;
    }>,
    totalPar: number,
    totalDistance: number
  ) => {
    setIsCreating(true);
    setError(null);
    
    try {
      const validHoles = holes.map((hole) => ({
        hole_number: hole.hole_number,
        par: hole.par as number,
        distance: hole.distance as number,
      }));

      const newCourse = await createCourse({
        name: courseName,
        holes: validHoles,
        totalPar,
        totalDistance
      });
      
      setCourses(prev => [...prev, newCourse]);
      return newCourse;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, []);

  // Delete a course
  const removeCourse = useCallback(async (id: string) => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await deleteCourse(id);
      setCourses(prev => prev.filter(course => course.id !== id));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    courses,
    isLoading,
    isCreating,
    isDeleting,
    error,
    loadCourses,
    createCourseWithHoles,
    removeCourse
  };
} 