import React from 'react';
import { useCourses } from '@/hooks/useCourses';

interface CourseSelectProps {
  selectedCourseId: string | null;
  onCourseSelect: (courseId: string | null) => void;
}

export default function CourseSelect({ selectedCourseId, onCourseSelect }: CourseSelectProps) {
  const { courses, loading, error } = useCourses();

  if (loading) {
    return <div className="text-gray-600">Loading courses...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Course
        <select
          value={selectedCourseId || ''}
          onChange={(e) => onCourseSelect(e.target.value || null)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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