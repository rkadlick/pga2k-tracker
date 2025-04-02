import { useState } from 'react';
import Link from 'next/link';
import { Course } from '@/types';

interface CourseListProps {
  courses: Course[];
  onDelete: (id: string) => void;
  isAuthenticated: boolean;
}

export default function CourseList({ courses, onDelete, isAuthenticated }: CourseListProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setConfirmDelete(id);
  };

  const handleConfirmDelete = (id: string) => {
    onDelete(id);
    setConfirmDelete(null);
  };

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 text-[--muted]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <p className="text-[--muted] mb-4">No courses found.</p>
        {isAuthenticated && (
          <Link
            href="/courses/new"
            className="inline-flex items-center space-x-2 bg-[--primary] text-[--primary-foreground]
                     hover:bg-[--primary-hover] transition-colors px-6 py-2 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Your First Course</span>
          </Link>
        )}
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {courses.map((course) => (
        <li key={course.id} className="animate-fade-in">
          <div className="card hover:bg-[--primary]/5">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Course Icon */}
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg
                                bg-[--primary]/10 text-[--primary]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>

                  {/* Course Name */}
                  <Link
                    href={`/courses/${course.id}`}
                    className="text-[--foreground] hover:text-[--primary] font-medium transition-colors"
                  >
                    {course.name}
                  </Link>
                </div>

                {/* Actions */}
                {isAuthenticated && (
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/courses/${course.id}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-md text-sm
                               bg-[--primary]/10 text-[--primary] hover:bg-[--primary]/20
                               transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Link>

                    {confirmDelete === course.id ? (
                      <>
                        <button
                          onClick={() => handleConfirmDelete(course.id)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md text-sm
                                   bg-rose-500/10 text-rose-600 dark:text-rose-400
                                   hover:bg-rose-500/20 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M5 13l4 4L19 7" />
                          </svg>
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md text-sm
                                   bg-[--primary]/5 text-[--muted] hover:text-[--foreground]
                                   hover:bg-[--primary]/10 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleDeleteClick(course.id)}
                        className="inline-flex items-center px-3 py-1.5 rounded-md text-sm
                                 bg-rose-500/10 text-rose-600 dark:text-rose-400
                                 hover:bg-rose-500/20 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
