import React from 'react';
import { useRouter } from 'next/navigation';

interface MatchesHeaderProps {
  isAuthenticated: boolean;
}

export default function MatchesHeader({ isAuthenticated }: MatchesHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-[--foreground]">Match History</h1>
      
      {isAuthenticated && (
        <button
          onClick={() => router.push('/matches/new')}
          className="button inline-flex items-center"
        >
          Add New Match
        </button>
      )}
    </div>
  );
} 