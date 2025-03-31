import React from 'react';
import { useRouter } from 'next/navigation';

interface MatchesHeaderProps {
  isAuthenticated: boolean;
}

export default function MatchesHeader({ isAuthenticated }: MatchesHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-[--foreground]">Match History</h1>
        
        {isAuthenticated && (
          <button
            onClick={() => router.push('/matches/new')}
            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-[--primary] hover:bg-[--primary-hover] focus:outline-none focus:ring-2 focus:ring-[--primary] transition-colors"
          >
            <svg 
              className="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
            Add New Match
          </button>
        )}
      </div>
      <p className="text-[--muted]">View and manage your match history.</p>
    </div>
  );
} 