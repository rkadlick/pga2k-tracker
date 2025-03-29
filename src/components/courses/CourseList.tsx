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
    <div className="bg-[--card-bg] border border-[--border] rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-[--border]">
        <thead className="bg-[--input-bg]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[--muted] uppercase tracking-wider">
              Course Name
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[--muted] uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-[--card-bg] divide-y divide-[--border]">
          {courses.length === 0 ? (
            <tr>
              <td colSpan={2} className="px-6 py-4 text-center text-[--muted]">
                No courses added yet. Create your first course to get started.
              </td>
            </tr>
          ) : (
            courses.map((course) => (
              <tr key={course.id} className="hover:bg-[--hover-bg]">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/courses/${course.id}`}
                    className="text-[--primary] hover:text-[--primary-hover] font-medium"
                  >
                    {course.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/courses/${course.id}`}
                      className="text-[--primary] hover:text-[--primary-hover] px-2 py-1"
                    >
                      Edit
                    </Link>
                    {confirmDelete === course.id ? (
                      <>
                        <button
                          onClick={() => handleConfirmDelete(course.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-2 py-1"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="text-[--muted] hover:text-[--foreground] px-2 py-1"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleDeleteClick(course.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-2 py-1"
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
