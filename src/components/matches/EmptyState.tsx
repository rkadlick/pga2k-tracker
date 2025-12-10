import React from 'react';
import { useRouter } from 'next/navigation';  
import { EmptyStateProps } from '@/types';

export default function EmptyState({ 
  isAuthenticated,
  title = 'No Matches Found',
  description = 'Get started by creating your first match.',
  actionLabel = 'Add Your First Match',
  actionPath = '/matches/new'
}: EmptyStateProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 
                    bg-[--card-bg] border border-[--border] rounded-lg 
                    animate-fade-in">
      {/* Golf Ball Illustration */}
      <div className="w-16 h-16 mb-6 text-[--muted]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-full h-full"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a10 10 0 0 1 10 10" />
          <path d="M12 2v4" />
          <path d="M12 18v4" />
          <path d="M4.93 4.93l2.83 2.83" />
          <path d="M16.24 16.24l2.83 2.83" />
          <path d="M2 12h4" />
          <path d="M18 12h4" />
          <path d="M4.93 19.07l2.83-2.83" />
          <path d="M16.24 7.76l2.83-2.83" />
        </svg>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-[--foreground] mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[--muted] text-center mb-6 max-w-sm">
        {description}
      </p>

      {/* Action Button */}
      {isAuthenticated && (
        <button
          onClick={() => router.push(actionPath)}
          className="inline-flex items-center space-x-2 bg-[--primary] text-[--primary-foreground]
                     hover:bg-[--primary-hover] transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            className="w-5 h-5"
          >
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
} 