// src/components/courses/CourseList.tsx
import { useState } from 'react';
import Link from 'next/link';
import { Course } from '@/types';

interface CourseListProps {
  courses: Course[];
  onDelete: (id: string) => void;
}

export default function CourseList({ courses, onDelete }: CourseListProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setConfirmDelete(id);
  };

  const handleConfirmDelete = (id: string) => {
    onDelete(id);
    setConfirmDelete(null);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Course Name
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {courses.length === 0 ? (
            <tr>
              <td colSpan={2} className="px-6 py-4 text-center text-gray-500">
                No courses added yet. Create your first course to get started.
              </td>
            </tr>
          ) : (
            courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/courses/${course.id}`}
                    className="text-blue-600 hover:text-blue-900 font-medium"
                  >
                    {course.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/courses/${course.id}`}
                      className="text-indigo-600 hover:text-indigo-900 px-2 py-1"
                    >
                      Edit
                    </Link>
                    {confirmDelete === course.id ? (
                      <>
                        <button
                          onClick={() => handleConfirmDelete(course.id)}
                          className="text-red-600 hover:text-red-900 px-2 py-1"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="text-gray-600 hover:text-gray-900 px-2 py-1"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleDeleteClick(course.id)}
                        className="text-red-600 hover:text-red-900 px-2 py-1"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
