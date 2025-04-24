"use client";

import { useState } from "react";
import CourseList from "@/components/courses/CourseList";
import CourseForm from "@/components/courses/CourseForm";
import { useCourses } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";
import { sortCourses, SortOption } from "@/utils/courseSorting";

/**
 * Alternative implementation of the Courses page using the domain-specific hook
 * This shows how much cleaner the component becomes when using a custom hook
 */
export default function CoursesPageAlternative() { // Renamed to avoid conflicts
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');
  const { isAuthenticated } = useAuth();
  
  const { 
    courses, 
    isLoading, 
    error, 
    createCourseWithHoles
  } = useCourses();

  // Sort courses based on selected option
  const sortedCourses = sortCourses(courses, sortBy);

  const handleAddCourse = async (
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
    totalDistance: number
  ) => {
    try {
      await createCourseWithHoles(courseName, holes, frontPar, backPar, totalPar, frontDistance, backDistance, totalDistance);
      setIsAddingCourse(false);
    } catch (err) {
      console.error("Error adding course:", err);
    }
  };

  const errorMessage = error ? (typeof error === 'string' ? error : 'An error occurred') : null;

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl course-title text-[--foreground]">Course Management</h1>
          {!isAddingCourse && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-[--muted]">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm bg-[--background] border border-[--border] rounded-md px-2 py-1"
              >
                <option value="alphabetical">A-Z</option>
                <option value="winPercentage">Win %</option>
                <option value="mostPlayed">Most Played</option>
              </select>
            </div>
          )}
        </div>

        {!isAddingCourse && isAuthenticated && (
          <button
            onClick={() => setIsAddingCourse(true)}
            className="inline-flex items-center"
          >
            Add New Course
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="card border-l-4 border-l-red-500">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-500">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {isAddingCourse ? (
          <CourseForm
            onSubmit={handleAddCourse}
            onCancel={() => setIsAddingCourse(false)}
          />
      ) : isLoading ? (
        <div className="card flex flex-col items-center justify-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-[--primary] mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-2 text-[--muted]">Loading courses...</p>
        </div>
      ) : (
        <CourseList courses={sortedCourses} isAuthenticated={isAuthenticated} />
      )}
    </div>
  );
}