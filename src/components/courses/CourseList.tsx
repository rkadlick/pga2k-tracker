import Link from 'next/link';
import { CourseListProps } from '@/types';
import CourseItem from './CourseItem';



export default function CourseList({ courses, isAuthenticated }: CourseListProps) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {courses.map((course) => (
        <div key={course.id} className="animate-fade-in">
          <CourseItem
            course={course}
            isAuthenticated={isAuthenticated}
          />
        </div>
      ))}
    </div>
  );
}
