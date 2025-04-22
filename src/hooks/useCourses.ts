import { useState, useEffect, useCallback } from 'react';
import { Course } from '@/types';
import * as courseClient from '@/lib/api/courseClient';
import { useMatches } from './useMatches';

/**
 * A hook for managing courses data and operations
 */
export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { matches } = useMatches();

  // Calculate course records from matches
  const calculateCourseRecords = useCallback((coursesData: Course[]) => {
    return coursesData.map(course => {
      const courseMatches = matches.filter(match => match.course_id === course.id);
      const record = courseMatches.reduce(
        (acc, match) => {
          // Since winner_id is always present, we can directly check if your team won
          const isYourTeamWinner = match.winner_id === match.your_team_id;
          if (isYourTeamWinner) {
            acc.wins++;
          } else {
            acc.losses++;
          }
          return acc;
        },
        { wins: 0, losses: 0 }
      );

      return {
        ...course,
        wins: record.wins,
        losses: record.losses,
      };
    });
  }, [matches]);

  // Load courses on mount only
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseClient.fetchCourses();
        const coursesWithRecords = calculateCourseRecords(data);
        setCourses(coursesWithRecords);
      } catch (err) {
        console.error('Failed to load courses:', err);
        setError('Failed to load courses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [calculateCourseRecords]);

  // Function to load courses
  const loadCourses = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await courseClient.fetchCourses();
      const coursesWithRecords = calculateCourseRecords(data);
      setCourses(coursesWithRecords);
      return coursesWithRecords;
    } catch (err) {
      console.error('Failed to load courses:', err);
      setError('Failed to load courses');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, calculateCourseRecords]);

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
      
      // Add initial record of 0-0
      const courseWithRecord = {
        ...newCourse,
        wins: 0,
        losses: 0
      };
      
      setCourses(prev => [...prev, courseWithRecord]);
      return courseWithRecord;
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
      
      // Preserve the record when updating
      const existingCourse = courses.find(c => c.id === id);
      const courseWithRecord = {
        ...updatedCourse,
        wins: existingCourse?.wins || 0,
        losses: existingCourse?.losses || 0
      };
      
      // Update the courses list with the updated course
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === id ? courseWithRecord : course
        )
      );
      
      return courseWithRecord;
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
      
      // Calculate record for the single course
      const courseMatches = matches.filter(match => match.course_id === id);
      const record = courseMatches.reduce(
        (acc, match) => {
          const isYourTeamWinner = match.winner_id === match.your_team_id;
          if (isYourTeamWinner) {
            acc.wins++;
          } else {
            acc.losses++;
          }
          return acc;
        },
        { wins: 0, losses: 0 }
      );

      const courseWithRecord = {
        ...courseData,
        wins: record.wins,
        losses: record.losses
      };
      
      // Update the courses list with the fetched course
      setCourses(prevCourses => {
        const courseIndex = prevCourses.findIndex(c => c.id === id);
        if (courseIndex >= 0) {
          // Replace the existing course
          const newCourses = [...prevCourses];
          newCourses[courseIndex] = courseWithRecord;
          return newCourses;
        } else {
          // Add the new course
          return [...prevCourses, courseWithRecord];
        }
      });
      
      return courseWithRecord;
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
    getCourseById
  };
} 