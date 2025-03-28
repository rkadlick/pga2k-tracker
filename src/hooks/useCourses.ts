import { useState, useEffect, useCallback, useRef } from 'react';
import { Course } from '@/types';
import * as courseClient from '@/lib/api/courseClient';

/**
 * A hook for managing courses data and operations
 */
export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Use a ref to prevent the effect from running more than once
  const initialized = useRef(false);
  
  // Load courses on mount only
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseClient.fetchCourses();
        setCourses(data);
      } catch (err) {
        console.error('Failed to load courses:', err);
        setError('Failed to load courses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Function to load courses
  const loadCourses = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await courseClient.fetchCourses();
      setCourses(data);
      return data;
    } catch (err) {
      console.error('Failed to load courses:', err);
      setError('Failed to load courses');
      throw err;
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
    frontPar: number,
    backPar: number,
    totalPar: number,
    frontDistance: number,
    backDistance: number,
    totalDistance: number,
  ) => {
    setIsCreating(true);
    setError(null);
    
    try {
      const validHoles = holes.map((hole) => ({
        hole_number: hole.hole_number,
        par: hole.par as number,
        distance: hole.distance as number,
      }));

      console.log('totalPar', totalPar);
      console.log('totalDistance', totalDistance);
      const newCourse = await courseClient.createCourse({
        name: courseName,
        holes: validHoles,
        frontPar,
        backPar,
        totalPar,
        frontDistance,
        backDistance,
        totalDistance
      });
      
      setCourses(prev => [...prev, newCourse]);
      return newCourse;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message);
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
      await courseClient.deleteCourse(id);
      setCourses(prev => prev.filter(course => course.id !== id));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  // Add or update the updateCourse function
  const updateCourse = async (
    id: string,
    name: string,
    holes: Array<{ 
      id: string; 
      hole_number: number; 
      par: number | null; 
      distance: number | null;
      course_id: string;
    }>,
    frontPar: number,
    backPar: number,
    totalPar: number,
    frontDistance: number,
    backDistance: number,
    totalDistance: number
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedCourse = await courseClient.updateCourse(
        id, 
        name, 
        holes, 
        frontPar, 
        backPar, 
        totalPar, 
        frontDistance, 
        backDistance, 
        totalDistance
      );
      
      // Update the courses list with the updated course
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === id ? updatedCourse : course
        )
      );
      
      return updatedCourse;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Add a function to get a single course by ID
  const getCourseById = async (id: string): Promise<Course> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First try to find the course in the existing state
      const existingCourse = courses.find(course => course.id === id);
      if (existingCourse && existingCourse.holes && existingCourse.holes.length > 0) {
        return existingCourse;
      }
      
      // If not found in state or doesn't have holes, fetch it directly
      const courseData = await courseClient.fetchCourse(id);
      
      // Update the courses list with the fetched course
      setCourses(prevCourses => {
        const courseIndex = prevCourses.findIndex(c => c.id === id);
        if (courseIndex >= 0) {
          // Replace the existing course
          const newCourses = [...prevCourses];
          newCourses[courseIndex] = courseData;
          return newCourses;
        } else {
          // Add the new course
          return [...prevCourses, courseData];
        }
      });
      
      return courseData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getCourseWithHoles = async (courseId: string): Promise<Course | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/courses/${courseId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    courses,
    isLoading,
    error,
    isCreating,
    isDeleting,
    loadCourses,
    createCourseWithHoles,
    removeCourse,
    updateCourse,
    getCourseById,
    getCourseWithHoles,
  };
} 