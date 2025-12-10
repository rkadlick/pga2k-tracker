import React from 'react';
import { useCourses } from '@/hooks/useCourses';
import { CourseSelectProps } from '@/types';


export default function CourseSelect({ selectedCourseId, onCourseSelect }: CourseSelectProps) {
  const { courses, isLoading, error } = useCourses();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-[--muted]">
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading courses...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 dark:text-red-400">{error}</div>;
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[--foreground]">
        Course
        <select
          value={selectedCourseId || ''}
          onChange={(e) => onCourseSelect(e.target.value || null)}
          className="mt-1 block w-full bg-[--input-bg] border border-[--input-border] text-[--foreground] rounded-lg px-4 py-2 
                   focus:border-[--input-focus] focus:ring-1 focus:ring-[--input-focus]
                   transition-all duration-200"
          required
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
} 