"use client";

import { useState, useEffect } from "react";
import { Course } from "@/types";
import CourseList from "@/components/courses/CourseList";
import CourseForm from "@/components/courses/CourseForm";
import { fetchCourses, createCourse, deleteCourse } from "@/lib/api/courseClient";
import { useApiRequest } from "@/hooks/useApiRequest";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  
  // Use the API request hook for fetching courses
  const { 
    execute: loadCourses, 
    isLoading, 
    error 
  } = useApiRequest(fetchCourses, {
    onSuccess: (data) => setCourses(data)
  });
  
  // Use the API request hook for creating a course
  const { 
    execute: handleCreateCourse,
    isLoading: isCreating
  } = useApiRequest(createCourse, {
    onSuccess: (newCourse) => {
      setCourses([...courses, newCourse]);
      setIsAddingCourse(false);
    }
  });
  
  // Use the API request hook for deleting a course
  const {
    execute: handleDeleteCourse
  } = useApiRequest(
    // We need to adapt the signature to match what useApiRequest expects
    (id: string) => deleteCourse(id),
    {
      onSuccess: () => {
        // We don't get the ID back from the API, so we use a closure
        // to capture the ID that was passed to handleDeleteCourse
        const deletedId = arguments[0];
        setCourses(courses.filter((course) => course.id !== deletedId));
      }
    }
  );

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleAddCourseWithHoles = async (
    courseName: string,
    holes: Array<{
      hole_number: number;
      par: number | null;
      distance: number | null;
    }>,
    totalPar: number,
    totalDistance: number
  ) => {
    try {
      const validHoles = holes.map((hole) => ({
        hole_number: hole.hole_number,
        par: hole.par as number,
        distance: hole.distance as number,
      }));

      await handleCreateCourse({
        name: courseName,
        holes: validHoles,
        totalPar,
        totalDistance
      });
    } catch (err) {
      // Error is already handled by the useApiRequest hook
      console.error("Error adding course with holes:", err);
    }
  };

  const handleDeleteCourseClick = async (id: string) => {
    try {
      await handleDeleteCourse(id);
    } catch (err) {
      // Error is already handled by the useApiRequest hook
      console.error("Error deleting course:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Course Management</h1>

        {!isAddingCourse && (
          <button
            onClick={() => setIsAddingCourse(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add New Course
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
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
              <p className="text-sm text-red-700">{error.message}</p>
            </div>
          </div>
        </div>
      )}

      {isAddingCourse ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Add New Course</h2>
          <CourseForm
            onSubmit={handleAddCourseWithHoles}
            onCancel={() => setIsAddingCourse(false)}
          />
        </div>
      ) : isLoading ? (
        <div className="text-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-blue-500 mx-auto"
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
          <p className="mt-2 text-gray-600">Loading courses...</p>
        </div>
      ) : (
        <CourseList courses={courses} onDelete={handleDeleteCourseClick} />
      )}
    </div>
  );
}
