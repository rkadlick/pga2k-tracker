'use client';

import Link from 'next/link';
import { Course } from '@/types';
import { GiGolfFlag } from "react-icons/gi";

interface CourseItemProps {
  course: Course;
  isAuthenticated: boolean;
}

export default function CourseItem({ course, isAuthenticated }: CourseItemProps) {
  return (
    <div className="card hover:bg-[var(--primary)]/5 h-full flex flex-col">
      <div className="p-4 flex flex-col h-full">
        {/* Course Icon and Name */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center text-[var(--primary)]">
            <GiGolfFlag className="w-11 h-11" />
          </div>
          <Link
            href={`/courses/${course.id}`}
            className="card-title"
          >
            {course.name}
          </Link>
        </div>

        {/* Record */}
        <div className="flex-1">
          <span className="card-meta">
            Record: {course.wins || 0}-{course.losses || 0}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-3 border-t border-[var(--border)]">
          <Link
            href={`/courses/${course.id}`}
            className="card-action group py-2.5 flex items-center justify-center gap-2"
          >
            <svg 
              className="w-[18px] h-[18px] text-[var(--muted)] group-hover:text-[var(--primary)] transition-colors duration-150" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
              />
            </svg>
            {isAuthenticated ? 'View & Edit' : 'View Details'}
          </Link>
        </div>
      </div>
    </div>
  );
} 